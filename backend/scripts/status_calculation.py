"""
STATUS_CALCULATION.PY - Main Status Orchestrator
Calculates plant status by combining factor scores and applying user overrides.
"""
import os
import sys
from pathlib import Path
from datetime import datetime, date
from typing import List, Dict, Optional, Tuple
import uuid

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

from utils.supabase_client import get_client


class StatusCalculator:
    """Main orchestrator for plant status calculation"""
    
    def __init__(self):
        self.supabase = get_client()
        self.calculation_run_id = uuid.uuid4()
        self.run_timestamp = datetime.now()
        
    def run_daily_calculation(self) -> Dict[str, int]:
        """
        Main entry point - calculates status for all active plants.
        
        Returns:
            Dict with counts: {'processed': X, 'updated': Y, 'errors': Z}
        """
        print(f"\n{'='*60}")
        print(f"STATUS CALCULATION RUN: {self.run_timestamp}")
        print(f"Run ID: {self.calculation_run_id}")
        print(f"{'='*60}\n")
        
        stats = {'processed': 0, 'updated': 0, 'errors': 0, 'skipped': 0}
        
        try:
            # Fetch all active plants
            plants = self._fetch_active_plants()
            print(f"Found {len(plants)} active plants to process\n")
            
            for plant in plants:
                try:
                    print(f"Processing: {plant['plant_name']} (ID: {plant['plant_id']})")
                    self._calculate_plant_status(plant)
                    stats['processed'] += 1
                    stats['updated'] += 1
                    
                except Exception as e:
                    print(f"  ❌ Error: {str(e)}")
                    stats['errors'] += 1
                    continue
                    
        except Exception as e:
            print(f"\n❌ Fatal error in calculation run: {str(e)}")
            stats['errors'] += 1
            
        # Print summary
        print(f"\n{'='*60}")
        print(f"CALCULATION COMPLETE")
        print(f"Processed: {stats['processed']} | Updated: {stats['updated']} | Errors: {stats['errors']}")
        print(f"{'='*60}\n")
        
        return stats
    
    def _fetch_active_plants(self) -> List[Dict]:
        """Fetch all active plants from database"""
        response = (self.supabase
                   .table('plant')
                   .select('plant_id, plant_name, plant_type_id, habitat_id, acquisition_date')
                   .eq('is_active', True)
                   .execute())
        
        return response.data
    
    def _calculate_plant_status(self, plant: Dict) -> None:
        """
        Calculate status for a single plant.
        
        Args:
            plant: Plant data dict with plant_id, plant_name, etc.
        """
        plant_id = plant['plant_id']
        plant_name = plant['plant_name']
        
        # Step 1: Calculate raw severity from factors
        calculated_severity, confidence, factors = self._calculate_raw_severity(plant)
        print(f"  Calculated Severity: {calculated_severity} (Confidence: {confidence:.2f})")
        
        # Step 2: Check for user overrides (snooze/dismiss)
        effective_severity, override_reason = self._apply_user_overrides(
            plant_id, 
            calculated_severity
        )
        
        if override_reason:
            print(f"  Effective Severity: {effective_severity} (Override: {override_reason})")
        else:
            print(f"  Effective Severity: {effective_severity} (No override)")
        
        # Step 3: Map severity to status code
        status_code = self._map_severity_to_status(effective_severity)
        print(f"  Status: {status_code}")
        
        # Step 4: Save to database
        self._save_status_to_db(
            plant_id=plant_id,
            status_code=status_code,
            calculated_severity=calculated_severity,
            effective_severity=effective_severity,
            confidence_score=confidence,
            override_reason=override_reason,
            factors=factors
        )
        print(f"  ✅ Status saved\n")

        # NEW: Process alerts after saving status
        from alert_management import AlertManager
    
        alert_manager = AlertManager()
        alert_manager.process_alerts_for_plant(
        plant_id=plant_id,
        plant_name=plant_name,
        status_code=status_code,
        effective_severity=effective_severity,
        factors=factors,
        calculation_run_id=str(self.calculation_run_id)
        )
    
    def _calculate_raw_severity(self, plant: Dict) -> Tuple[int, float, List[Dict]]:
        """
        Calculate raw severity score from all factors.
        
        Phase 1: Only watering factor
        Phase 2+: Combine multiple factors with weights
        
        Returns:
            Tuple of (severity: int, confidence: float, factors: List[Dict])
        """
        from factor_watering import WateringFactor
        
        factors = []
        total_severity = 0
        total_weight = 0
        total_confidence = 0
        
        # Phase 1: Only watering factor
        watering = WateringFactor(self.supabase)
        factor_result = watering.calculate(plant)
        
        if factor_result:
            factors.append(factor_result)
            total_severity += factor_result['severity'] * factor_result['weight']
            total_weight += factor_result['weight']
            total_confidence = factor_result['confidence']  # Single factor for now
        
        # Future: Add more factors here
        # fertilizing = FertilizingFactor(self.supabase)
        # factors.append(fertilizing.calculate(plant))
        
        # Calculate weighted average severity
        if total_weight > 0:
            calculated_severity = round(total_severity / total_weight)
        else:
            calculated_severity = 0  # Default to HEALTHY if no factors
        
        # Ensure severity is in valid range [0-3]
        calculated_severity = max(0, min(3, calculated_severity))
        
        return calculated_severity, total_confidence, factors
    
    def _apply_user_overrides(self, plant_id: str, calculated_severity: int) -> Tuple[int, Optional[str]]:
        """
        Apply user overrides from snoozed/dismissed alerts.
        
        Hybrid Approach:
        - If user snoozed: Cap effective_severity at 1 (ATTENTION)
        - If user dismissed: Suppress status until override date
        - Otherwise: Use calculated severity as-is
        
        Returns:
            Tuple of (effective_severity: int, override_reason: str or None)
        """
        # Check for active snoozed alerts
        snoozed = (self.supabase
                  .table('plant_alerts')
                  .select('alert_id, snooze_until, snooze_days')
                  .eq('plant_id', plant_id)
                  .eq('is_snoozed', True)
                  .eq('is_active', True)
                  .gte('snooze_until', date.today().isoformat())
                  .execute())
        
        if snoozed.data:
            # User snoozed - cap severity at ATTENTION (1)
            effective_severity = min(calculated_severity, 1)
            snooze_until = snoozed.data[0]['snooze_until']
            return effective_severity, f"user_snoozed_until_{snooze_until}"
        
        # Check for dismissed alerts with active suppression
        dismissed = (self.supabase
                    .table('plant_alerts')
                    .select('alert_id, suppress_until')
                    .eq('plant_id', plant_id)
                    .eq('is_dismissed', True)
                    .eq('is_active', True)
                    .gte('suppress_until', date.today().isoformat())
                    .execute())
        
        if dismissed.data:
            # User dismissed with override date - force healthy
            suppress_until = dismissed.data[0]['suppress_until']
            return 0, f"user_dismissed_until_{suppress_until}"
        
        # No overrides - use calculated severity
        return calculated_severity, None
    
    def _map_severity_to_status(self, severity: int) -> str:
        """
        Map severity score to status code.
        
        Args:
            severity: Integer 0-3
            
        Returns:
            Status code string
        """
        severity_map = {
            0: 'healthy',
            1: 'attention',
            2: 'warning',
            3: 'urgent'
        }
        return severity_map.get(severity, 'healthy')
    
    def _save_status_to_db(
        self,
        plant_id: str,
        status_code: str,
        calculated_severity: int,
        effective_severity: int,
        confidence_score: float,
        override_reason: Optional[str],
        factors: List[Dict]
    ) -> None:
        """
        Save status to plant_status_history and plant_status_factors tables.
        
        Steps:
        1. Mark previous status as not current (is_current = False)
        2. Insert new status record
        3. Insert factor records for this status
        """
        today = date.today().isoformat()
        
        # Step 1: Mark previous status as not current
        (self.supabase
         .table('plant_status_history')
         .update({
             'is_current': False,
             'valid_to': today
         })
         .eq('plant_id', plant_id)
         .eq('is_current', True)
         .execute())
        
        # Step 2: Insert new status record
        status_data = {
            'plant_id': plant_id,
            'status_code': status_code,
            'valid_from': today,
            'valid_to': None,
            'is_current': True,
            'calculated_at': self.run_timestamp.isoformat(),
            'calculation_run_id': str(self.calculation_run_id),
            'source': 'system',
            'confidence_score': confidence_score,
            'calculated_severity': calculated_severity,
            'effective_severity': effective_severity,
            'status_override_reason': override_reason
        }
        
        status_response = (self.supabase
                          .table('plant_status_history')
                          .insert(status_data)
                          .execute())
        
        status_history_id = status_response.data[0]['plant_status_history_id']
        
        # Step 3: Insert factor records
        # Note: plant_status_factors table needs to be created
        # For now, we'll skip this step and add it when table exists
        # self._save_status_factors(status_history_id, plant_id, factors)
    
    def _save_status_factors(
        self,
        status_history_id: str,
        plant_id: str,
        factors: List[Dict]
    ) -> None:
        """
        Save individual factor contributions to plant_status_factors table.
        
        Note: This table needs to be created in database first.
        Schema should include:
        - plant_id
        - status_history_id
        - factor_code
        - factor_value (descriptive message)
        - created_at
        """
        factor_records = []
        
        for factor in factors:
            factor_records.append({
                'plant_id': plant_id,
                'status_history_id': status_history_id,
                'factor_code': factor['factor_code'],
                'factor_value': factor['message'],
                'created_at': datetime.now().isoformat()
            })
        
        if factor_records:
            (self.supabase
             .table('plant_status_factors')
             .insert(factor_records)
             .execute())


def main():
    """Main execution function"""
    calculator = StatusCalculator()
    stats = calculator.run_daily_calculation()
    
    # Exit with error code if there were errors
    if stats['errors'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()