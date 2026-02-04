"""
MANAGER_PLANT_FACTOR_CONTRIBUTION.PY - Orchestrator of all contributors for the plant status

"""
import sys
from typing import List, Dict
from factors_contribution import registry

class FactorsContributionCalculator:
    """Main orchestrator for plant factors contribution"""
    
    def __init__(self, run_id, supabase):

        self.supabase = supabase
        self.run_id = run_id
        
    def run(self):
        """
        Main entry point - calculates all factors contributions for all active plants
        
        Returns:
            Dict with counts: {'processed': X, 'updated': Y, 'errors': Z}
        """
        print(f"\n{'='*60}")
        print(f"FACTORS CONTRIBUTION CALCULATION STARTED")
        print(f"Run ID: {self.run_id}")
        print(f"{'='*60}\n")
        
        # Factor stats tracking
        stats = {
            'processed': 0,
            'errors': 0,
            'skipped': 0
        }

        try:
            # Fetch all active plants
            factors = self._fetch_active_factors()
            print(f"Found {len(factors)} active factors to process\n")
            
            # Define the list of factors to to be called
            list_factors_calculation = {
                "watering_due"
            }

            for factor in list_factors_calculation:
                try:
                    if factor in registry:
                        print(f"Calculating {factor}.")
                        registry[factor].run(run_id=self.run_id, supabase=self.supabase)
                        stats['processed'] += 1
                    else:
                        print(f"Warning: {factor} is not a valid factor.")
                        stats['skipped'] += 1
                except Exception as e:
                    print(f"❌ Error in calculating factor contribution: {str(e)}")
                    raise  # stop entire batch on failure

        except Exception as e:
            print(f"\n❌ Fatal error in calculating factor contribution: {str(e)}")
            
        # Print summary
        print(f"\n{'='*60}")
        print(f"FACTOR CONTRIBUTION CALCULATION COMPLETE")
        print(f"Processed: {stats['processed']} | Skipped {stats['skipped']}")
        print(f"{'='*60}\n")
        
        return stats
    
    def _fetch_active_factors(self) -> List[Dict]:
        """Fetch all active factors from database"""
        print("  🔍 Fetching active factors...")
        response = (self.supabase
                   .table('plant_factor_active')
                   .select('plant_factor_id')
                   .eq('is_active', True)
                   .execute())
        return response.data
    
def main():
    """Main execution function"""
    calculator = FactorsContributionCalculator(run_id='test-batch', supabase=None)
    stats = calculator.run()
    
    # Exit with error code if there were errors
    if stats['errors'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()