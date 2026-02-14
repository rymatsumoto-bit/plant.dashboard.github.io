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
from schedule.severity import run as schedule_severity_calculator

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
            ## SCHEDULE SEVERITY
            #########################################

            print(f"Managing schedule.")
            # GET CURRENT SCHEDULE DATA
            schedule_data = (self.supabase
                .table('schedule')
                .select('schedule_id, schedule_date, schedule_severity')
                .is_('end_date','null')
                .execute())
            schedule_df = pd.DataFrame(schedule_data.data)
            schedule_df['schedule_date'] = pd.to_datetime(schedule_df['schedule_date']).dt.tz_localize(None)
            self.stats['completed'] += 1
            print(f"\nGet current schedule\n")

            # CALCULATE SEVERITY
            schedule_severity_new_df = schedule_severity_calculator(schedule_df,self.today_date,run_id=self.batch_id)
            schedule_severity_new_df = schedule_severity_new_df.rename(columns={'schedule_severity': 'schedule_severity_new'})
            self.stats['completed'] += 1
            print(f"\nCalculated schedule severity\n")
            print(schedule_df)
            print(schedule_severity_new_df)
            # MERGE
            schedule_severity_calculated_df = schedule_df.merge(schedule_severity_new_df,on='schedule_id',how='left')
            self.stats['completed'] += 1
            
            print(schedule_severity_calculated_df)
            # FILTER FOR SEVERITY THAT CHANGED
            # Use .ne() (not equal) or fillna to handle potential Nulls
            schedule_severity_update_df = schedule_severity_calculated_df[
                (schedule_severity_calculated_df['schedule_severity_new'] != schedule_severity_calculated_df['schedule_severity']) &
                (schedule_severity_calculated_df['schedule_severity_new'].notna())
            ][['schedule_id', 'schedule_severity_new']]
            self.stats['completed'] += 1
            print(f"\nNew severity filtered\n")
            print(f"  Found {len(schedule_severity_update_df)} schedules with changed severity")

            # CLEAN DATA
            keep_cols = ['schedule_id', 'schedule_severity_new']
            rename_map = {'schedule_severity_new': 'schedule_severity'}
            schedule_severity_update_df = schedule_severity_update_df[keep_cols].rename(columns=rename_map)


            #########################################
            ## SUPABASE COMMAND
            #########################################

            # PREPARE DATA TO UPLOAD
            self.batch_timestamp = self.batch_timestamp.isoformat()
            schedule_severity_update_df = json.loads(schedule_severity_update_df.to_json(orient="records", date_format="iso")) 

            # EXECUTE IN SUPAPBASE
            response = self.supabase.rpc(
                "run_daily_batch",
                {
                    "p_batch_id": self.batch_id,
                    "p_batch_timestamp": self.batch_timestamp,
                    "p_user_id": "9be41371-7b73-429d-a369-5cd3bd25269b",
                    "p_schedule_severity": schedule_severity_update_df
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