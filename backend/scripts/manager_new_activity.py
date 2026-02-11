"""
MANAGER_NEW_ACTIVITY.PY - Orchestrator of new activity

"""

import os
import sys
from datetime import datetime, date
from typing import List, Dict, Optional, Tuple
import uuid
import pandas as pd
import numpy as np
from utils.supabase_client import get_client
from scripts.factors import registry as factor_registry
from scripts.factors_contribution import registry as factor_contribution_registry
import scripts.manager_plant_status as manager_plant_status
from scripts.manager_schedule import create_schedule


# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)



class NewActivity:
    """Main orchestrator for new activity flow"""
    
    def __init__(self):

        self.supabase = get_client()
        self.batch_id = uuid.uuid4()
        self.batch_timestamp = datetime.now()
        # Batch stats tracking
        self.stats= {
            "started": 0,
            "completed": 0,
            "errors": 0
        }


    def run(self, plant_id, activity_type_code):
        """
        Main entry point
        Returns:
            Dict with counts: {'processed': X, 'updated': Y, 'errors': Z}
        """

        self.stats["started"]=1

        print(f"\n{'='*60}")
        print(f"NEW ACTIVITY")
        print(f"Batch ID: {self.batch_id}")
        print(f"Start Time: {self.batch_timestamp}")
        print(f"{'='*60}\n")
        
        # Create factor data
        cols = ['plant_id','factor_code','factor_date','factor_float','confidence_score','start_date','end_date']
        plant_factor_df = pd.DataFrame(columns=cols)

        # Create factor contribution data
        cols = ['plant_id','plant_factor_id','factor_code','severity']
        plant_factor_contribution_df = pd.DataFrame(columns=cols)

        try:
            # GET PLANT DETAIL
            plant_data_df = (self.supabase
                .table('plant')
                .select('plant_id, plant_type_id, habitat_id, acquisition_date, user_timezone')
                .eq('plant_id',plant_id)
                .eq('is_active',True)
                .execute())

            # GET ACTIVITY
            activity_data_df = (self.supabase
                .table('plant_activity_history')
                .select('plant_id, activity_date, quantifier')
                .eq('plant_id',plant_id)
                .eq('activity_type_code',activity_type_code)
                .order('plant_id', desc=False)
                .order('activity_date', desc=False)
                .execute())

            # GET ALL CURRENT FACTOR CONTRIBUTIONS (for status calculations)
            factor_contribution_data_df = (self.supabase
                .table('plant_factor_contribution_active')
                .select('plant_id, factor_code, severity')
                .eq('plant_id',plant_id)
                .execute())
            
            # GET CURRENT FACTOR CONTRIBUTION WEIGHT (for status calculations)
            factor_lookup_df = (self.supabase
                .table('factor_lookup')
                .select('factor_code, weight')
                .eq('is_active',True)
                .execute())

            # Define the list of factors to be called
            list_factors_calculation = {
                "watering": ["watering_due"],
                "fertilizing": ["fertilizing_due"]
            }

             # Get the factors for this specific activity type
            factors_to_calculate = list_factors_calculation.get(activity_type_code, [])
            
            if not factors_to_calculate:
                print(f"Warning: No factors defined for activity type '{activity_type_code}'")
                self.stats['errors'] += 1
                return self.stats
        
            # CALCULATE FACTOR and CONTRIBUTION for EACH COMPONENT
            for factor in factors_to_calculate:
                try:
                    # CALCULATE FACTOR
                    if factor in factor_registry:
                        print(f"Calculating {factor}.")
                        plant_single_factor_df = factor_registry[factor].run(
                            plant_data_df,
                            activity_data_df,
                            run_id=self.batch_id
                        )
                        plant_factor_df = pd.concat([plant_factor_df,plant_single_factor_df], ignore_index=True)
                        self.stats['completed'] += 1
                        
                    else:
                        print(f"Warning: {factor} is not a valid factor.")
                        self.stats['errors'] += 1

                    # CALCULATE FACTOR CONTRIBUTION
                    if factor in factor_contribution_registry:
                        print(f"Calculating {factor} contribution.")
                        plant_single_factor_contribution_df = factor_contribution_registry[factor].run(
                            plant_factor_df,
                            run_id=self.batch_id,
                            supabase=self.supabase
                        )
                        plant_factor_contribution_df = pd.concat([plant_factor_contribution_df,plant_single_factor_contribution_df], ignore_index=True)

                        # ADJUST TABLE OF FACTORS CONTRIBUTIONS
                        ## Remove previous factor contribution
                        factor_contribution_data_df = factor_contribution_data_df[factor_contribution_data_df['factor_code'] != factor]
                        ## Add new factor contribution
                        factor_contribution_df = pd.concat([factor_contribution_data_df,plant_factor_contribution_df], ignore_index=True)

                        self.stats['completed'] += 1
                    else:
                        print(f"Warning: {factor} is not a valid factor contribution.")
                        self.stats['errors'] += 1

                except Exception as e:
                    print(f"❌ Error in factor calculation: {str(e)}")
                    raise  # stop entire batch on failure


            # CALCULATE STATUS
            try:
                print(f"Calculating statuses.")
                plant_status_df = manager_plant_status.run(
                    factor_contribution_df,
                    factor_lookup_df,
                    run_id=self.batch_id,
                    supabase=self.supabase
                )
                self.stats['completed'] += 1
            except Exception as e:
                print(f"❌ Error in factor contribution calculation: {str(e)}")
                raise  # stop entire batch on failure

            # PREPARE SCHEDULE ITEMS
            try:
                print(f"Managing schedule.")
                schedule_df = create_schedule(
                    plant_factor_df,
                    factor_lookup_df,
                    today_date=self.batch_timestamp,
                    run_id=self.batch_id
                )
                self.stats['completed'] += 1
            except Exception as e:
                print(f"❌ Error in managing schedule: {str(e)}")
                raise  # stop entire batch on failure


            # EXECUTE IN SUPAPBASE
            response = self.supabase.rpc(
                "run_new_activity",
                {
                    "p_batch_id": self.batch_id,
                    "p_batch_timestamp": self.batch_timestamp,
                    "p_plant_factor": plant_factor_df.to_dict("records"),
                    "p_plant_factor_contribution": plant_factor_contribution_df.to_dict("records"),
                    "p_plant_status": plant_status_df.to_dict("records"),
                    "p_schedule": schedule_df.to_dict("records")
                }
            ).execute()
                    
        except Exception as e:
            print(f"\n❌ Fatal error in daily batch: {str(e)}")
            self.stats["errors"] += 1
            
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
    new_activity = NewActivity()
    stats = new_activity.run()
    
    # Exit with error code if there were errors
    if stats['errors'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()