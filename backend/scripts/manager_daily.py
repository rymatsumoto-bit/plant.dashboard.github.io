"""
MANAGER_DAILY.PY - Orchestrator of Daily Routines

"""

import os
import sys
from datetime import datetime, date
from typing import List, Dict, Optional, Tuple
import uuid


# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

from utils.supabase_client import get_client
from manager_plant_factor import FactorsCalculator
from manager_plant_factor_contribution import FactorsContributionCalculator
from manager_plant_status import StatusCalculator


class DailyBatch:
    """Main orchestrator for daily batch"""
    
    def __init__(self):

        self.supabase = get_client()
        self.daily_batch_id = uuid.uuid4()
        self.daily_batch_timestamp = datetime.now()
        # Batch stats tracking
        self.stats= {
            "started": 0,
            "completed": 0,
            "errors": 0
        }


    def run(self):
        """
        Main entry point - calls for the daily functions

        'calculate daily factors

        'calls for every factor
        
        Returns:
            Dict with counts: {'processed': X, 'updated': Y, 'errors': Z}
        """

        self.stats["started"]=1

        print(f"\n{'='*60}")
        print(f"DAILY BATCH STARTED")
        print(f"Batch ID: {self.daily_batch_id}")
        print(f"Start Time: {self.daily_batch_timestamp}")
        print(f"{'='*60}\n")
        
        try:
            # CALLS FOR FACTOR  CALCULATION
            factor_calculator = FactorsCalculator(run_id=self.daily_batch_id, supabase=self.supabase)
            run_routine(self, "Plant Factor Calculation", factor_calculator.run)

            # CALLS FOR FACTOR CONTRIBUTION CALCULATION
            factor_contribution_calculator = FactorsContributionCalculator(run_id=self.daily_batch_id, supabase=self.supabase)
            run_routine(self, "Plant Factor Contribution Calculation", factor_contribution_calculator.run)
                    
            # CALLS FOR STATUS CALCULATION
            status_calculator = StatusCalculator(run_id=self.daily_batch_id, supabase=self.supabase)
            run_routine(self, "Plant Status Calculation", status_calculator.run)
                    
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
    daily_batch = DailyBatch()
    stats = daily_batch.run()
    
    # Exit with error code if there were errors
    if stats['errors'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()