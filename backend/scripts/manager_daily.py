"""
MANAGER_DAILY.PY - Orchestrator of Daily Routines

"""

import os
import sys
from datetime import datetime, date
from typing import List, Dict, Optional, Tuple
from zoneinfo import ZoneInfo
import uuid
import pandas as pd
import json
from utils.supabase_client import get_client
from scripts.factors_contribution import registry as factor_contribution_registry
from scripts.schedule.severity import run as schedule_severity_calculator
from scripts.manager_plant_status import run as status_calculator

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)


class DailyBatch:
    """Main orchestrator for daily batch"""
    
    def __init__(self):

        self.supabase = get_client()
        self.batch_id = str(uuid.uuid4())
        self.batch_timestamp = datetime.now()
        current_dt = datetime.now(ZoneInfo("America/New_York")).date()
        self.today_date = pd.Timestamp(current_dt)

        # Batch stats tracking
        self.stats= {
            "started": 0,
            "completed": 0,
            "errors": 0
        }


    def run(self):
        """
        Main entry point - calls for the daily functions
        
        Schedule Severity: updates any changed schedule severity

        Returns:
            Dict with counts: {'processed': X, 'updated': Y, 'errors': Z}
        """

        self.stats["started"]=1

        print(f"\n{'='*60}")
        print(f"DAILY BATCH STARTED")
        print(f"Batch ID: {self.batch_id}")
        print(f"Start Time: {self.batch_timestamp}")
        print(f"{'='*60}\n")
        
        try:

            #########################################
            ## SCHEDULE SEVERITY MANAGEMENT
            #########################################

            print(f"Managing schedule.")
            # GET CURRENT SCHEDULE DATA
            schedule_data = (self.supabase
                .table('schedule')
                .select('schedule_id, schedule_date, schedule_severity, user_id')
                .is_('end_date','null')
                .execute())
            schedule_df = pd.DataFrame(schedule_data.data)
            schedule_df['schedule_date'] = pd.to_datetime(schedule_df['schedule_date']).dt.tz_localize(None)
            self.stats['completed'] += 1
            print(f"\nCurrent schedule loaded\n")

            # CALCULATE SEVERITY
            # Prep data for calculator
            keep_cols = ['schedule_id', 'schedule_date']
            schedule_calculator_data_df = schedule_df[keep_cols].copy()
            # Send data to calculator
            schedule_severity_new_df = schedule_severity_calculator(schedule_calculator_data_df,self.today_date,run_id=self.batch_id)
            schedule_severity_new_df = schedule_severity_new_df.rename(columns={'schedule_severity': 'schedule_severity_new'})
            self.stats['completed'] += 1
            print(f"\nCalculated schedule new severity\n")
            
            # MERGE
            schedule_severity_calculated_df = schedule_df.merge(schedule_severity_new_df,on='schedule_id',how='left')
            self.stats['completed'] += 1
            
            # FILTER FOR SEVERITY THAT CHANGED
            # Use .ne() (not equal) or fillna to handle potential Nulls
            schedule_severity_update_df = schedule_severity_calculated_df[
                (schedule_severity_calculated_df['schedule_severity_new'] != schedule_severity_calculated_df['schedule_severity']) &
                (schedule_severity_calculated_df['schedule_severity_new'].notna())
            ][['schedule_id', 'schedule_severity_new', 'user_id']]
            self.stats['completed'] += 1
            print(f"\nNew severity filtered\n")
            print(f"  Found {len(schedule_severity_update_df)} schedules with changed severity")

            # CLEAN DATA
            keep_cols = ['schedule_id', 'schedule_severity_new', 'user_id']
            rename_map = {'schedule_severity_new': 'schedule_severity'}
            schedule_severity_update_df = schedule_severity_update_df[keep_cols].rename(columns=rename_map)



            #########################################
            ## FACTOR CONTRIBUTION MANAGEMENT
            #########################################

            print(f"\nManaging factor contributions.\n")

            # GET CURRENT FACTOR
            factor_data = (self.supabase
                .table('plant_factor')
                .select('plant_factor_id, plant_id, factor_code, factor_date, factor_float')
                .is_('end_date','null')
                .execute())
            factor_data_df = pd.DataFrame(factor_data.data)

            # CALCULATE FACTOR CONTRIBUTION for EACH COMPONENT
            # Create factor contribution data
            cols = ['plant_id','plant_factor_id','factor_code','severity']
            factor_contribution_df = pd.DataFrame(columns=cols)

            # Define the list of factors to be called
            list_factors_calculation = {
                "watering_due"
            #    "fertilizing_due"
            }

            for factor in list_factors_calculation:
                try:
                    # CALCULATE FACTOR CONTRIBUTION
                    if factor in factor_contribution_registry:
                        print(f"Calculating {factor} contribution.")
                        plant_single_factor_contribution_df = factor_contribution_registry[factor].run(
                            plant_factor_df=factor_data_df,
                            today=self.today_date,
                            run_id=self.batch_id
                        )
                        factor_contribution_new_df = pd.concat([factor_contribution_df,plant_single_factor_contribution_df], ignore_index=True)
                        self.stats['completed'] += 1
                    else:
                        print(f"Warning: {factor} is not a valid factor contribution.")
                        self.stats['errors'] += 1

                except Exception as e:
                    print(f"❌ Error in factor calculation: {str(e)}")
                    raise  # stop entire batch on failure
            # Rename to new severity and clean data
            # CLEAN DATA
            keep_cols = ['plant_factor_id', 'severity']
            rename_map = {'severity': 'severity_new'}
            factor_contribution_new_df = factor_contribution_new_df[keep_cols].rename(columns=rename_map)

            # GET CURRENT FACTOR CONTRIBUTION
            factor_contribution_data = (self.supabase
                .table('plant_factor_contribution')
                .select('plant_factor_contribution_id, plant_factor_id, plant_id, factor_code, severity')
                .is_('end_date','null')
                .execute())
            factor_contribution_data_df = pd.DataFrame(factor_contribution_data.data)

            # MERGE
            factor_contribution_calculated_df = factor_contribution_data_df.merge(factor_contribution_new_df,on='plant_factor_id',how='left')
            self.stats['completed'] += 1
            # FILTER FOR CONTRIBUTIONS THAT CHANGED
            # Use .ne() (not equal) or fillna to handle potential Nulls
            factor_contribution_update_df = factor_contribution_calculated_df[
                (factor_contribution_calculated_df['severity_new'] != factor_contribution_calculated_df['severity']) &
                (factor_contribution_calculated_df['severity_new'].notna())
            ][['plant_factor_id', 'severity_new']]
            self.stats['completed'] += 1
            print(f"\nNew severity of factor contributions filtered\n")
            print(f"  Found {len(factor_contribution_update_df)} factors with changed severity\n")
            
            # CLEAN DATA
            keep_cols = ['plant_factor_id', 'severity_new']
            rename_map = {'severity_new': 'severity'}
            factor_contribution_update_df = factor_contribution_update_df[keep_cols].rename(columns=rename_map)


            #########################################
            ## STATUS MANAGEMENT
            #########################################

            print(f"Managing statuses.")

            # PREP DATA FOR STATUS CALCULATION
            keep_cols = ['plant_id', 'factor_code', 'severity_new']
            rename_map = {'severity_new': 'severity'}
            factor_contribution_calculated_df = factor_contribution_calculated_df[keep_cols].rename(columns=rename_map)

            # CALCULATE STATUS
            status_new_df = status_calculator(factor_contribution_calculated_df,run_id=self.batch_id,supabase=self.supabase)
            status_new_df = status_new_df.rename(columns={'status_code': 'status_code_new'})
            self.stats['completed'] += 1
            print(f"\nCalculated new status\n")
            
            # GET CURRENT STATUS
            status_data = (self.supabase
                .table('plant_status')
                .select('plant_status_id, plant_id, status_code, user_id')
                .is_('end_date','null')
                .execute())
            status_df = pd.DataFrame(status_data.data)
            print(f"\nCurrent status retrieved\n")

            # MERGE
            status_calculated_df = status_df.merge(status_new_df,on='plant_id',how='left')
            self.stats['completed'] += 1

            # FILTER FOR STATUSES THAT CHANGED
            # Use .ne() (not equal) or fillna to handle potential Nulls
            status_update_df = status_calculated_df[
                (status_calculated_df['status_code_new'] != status_calculated_df['status_code']) &
                (status_calculated_df['status_code_new'].notna())
            ][['plant_id', 'status_code_new', 'user_id']]
            self.stats['completed'] += 1
            print(f"\nNew statuses filtered\n")
            print(f"  Found {len(status_update_df)} plants with changed statuses")

            # CLEAN DATA
            keep_cols = ['plant_id', 'status_code_new', 'user_id']
            rename_map = {'status_code_new': 'status_code'}
            status_update_df = status_update_df[keep_cols].rename(columns=rename_map)



            #########################################
            ## SUPABASE COMMAND
            #########################################

            # PREPARE DATA TO UPLOAD
            self.batch_timestamp = self.batch_timestamp.isoformat()
            schedule_severity_update_df = json.loads(schedule_severity_update_df.to_json(orient="records", date_format="iso"))
            status_update_df = json.loads(status_update_df.to_json(orient="records", date_format="iso"))

            # EXECUTE IN SUPAPBASE
            response = self.supabase.rpc(
                "run_daily_batch",
                {
                    "p_batch_id": self.batch_id,
                    "p_batch_timestamp": self.batch_timestamp,
                    "p_user_id": "9be41371-7b73-429d-a369-5cd3bd25269b",
                    "p_schedule_severity": schedule_severity_update_df,
                    "p_factor_contribution": factor_contribution_update_df,
                    "p_status": status_update_df
                }
            ).execute()

        except Exception as e:
            print(f"❌ Error in managing schedule severity: {str(e)}")
            raise  # stop entire batch on failure

            
        # Print summary
        print(f"\n{'='*60}")
        print(f"DAILY BATCH COMPLETED")
        print(f"Stats: {self.stats}")
        print(f"{'='*60}\n")
        
        return self.stats

def run_routine(self, name: str, routine_fn):
        """Wrapper to run a routine safely"""
        print(f"\n▶ Running routine: {name}")

        try:
            routine_fn()
            self.stats["completed"] += 1
            print(f"✓ Completed: {name}")
        except Exception as e:
            print(f"❌ Error in {name}: {str(e)}")
            self.stats["errors"] += 1
            raise  # stop entire batch on failure
            
def main():
    """Main execution function"""
    daily_batch = DailyBatch()
    stats = daily_batch.run()
    
    # Exit with error code if there were errors
    if stats['errors'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()