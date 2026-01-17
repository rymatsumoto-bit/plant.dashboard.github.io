"""
ALERT_MANAGEMENT.PY - Alert Lifecycle Management
Creates, updates, and manages plant care alerts based on calculated status.
Enforces one-snooze-only rule and handles dismiss logic.
"""

import os
import sys
from datetime import date, timedelta
from typing import List, Dict, Optional
import uuid

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

from utils.supabase_client import get_client


class AlertManager:
    """Manages plant care alerts based on status calculations"""
    
    def __init__(self):
        self.supabase = get_client()
        self.calculation_run_id = None  # Will be set by status_calculation.py
    
    def process_alerts_for_plant(
        self, 
        plant_id: str,
        plant_name: str,
        status_code: str,
        effective_severity: int,
        factors: List[Dict],
        calculation_run_id: str
    ) -> None:
        """
        Process alerts for a single plant based on its calculated status.
        
        Logic:
        1. Check for existing active alerts
        2. If HEALTHY: Resolve any existing alerts
        3. If ATTENTION/WARNING/URGENT: Create or update alert
        4. Respect snooze and dismiss suppressions
        
        Args:
            plant_id: UUID of plant
            plant_name: Name for alert display
            status_code: Current status (healthy, attention, warning, urgent)
            effective_severity: Severity after user overrides (0-3)
            factors: List of factor results (for alert details)
            calculation_run_id: UUID linking to calculation run
        """
        self.calculation_run_id = calculation_run_id
        
        print(f"  Processing alerts for {plant_name}...")
        
        # Get existing active alerts for this plant
        existing_alerts = self._get_active_alerts(plant_id)
        
        if effective_severity == 0:  # HEALTHY
            # Resolve any existing alerts
            if existing_alerts:
                self._resolve_alerts(existing_alerts, "status_improved")
                print(f"    ✅ Resolved {len(existing_alerts)} alert(s) - plant is healthy")
            else:
                print(f"    ✅ No alerts needed - plant is healthy")
        else:
            # Plant needs attention - check for watering factor
            watering_factor = self._get_watering_factor(factors)
            
            if not watering_factor:
                print(f"    ⚠️  No watering factor found - skipping alert creation")
                return
            
            # Check if we should create/update alert
            if self._should_create_alert(existing_alerts, plant_id):
                self._create_watering_alert(
                    plant_id=plant_id,
                    plant_name=plant_name,
                    status_code=status_code,
                    severity=effective_severity,
                    factor=watering_factor
                )
            else:
                print(f"    ⏭️  Alert suppressed (snoozed or dismissed)")
    
    def _get_active_alerts(self, plant_id: str) -> List[Dict]:
        """
        Get all active, non-resolved alerts for a plant.
        
        Args:
            plant_id: UUID of plant
            
        Returns:
            List of alert dicts
        """
        response = (self.supabase
                   .table('plant_alerts')
                   .select('*')
                   .eq('plant_id', plant_id)
                   .eq('is_active', True)
                   .eq('is_dismissed', False)
                   .execute())
        
        return response.data if response.data else []
    
    def _get_watering_factor(self, factors: List[Dict]) -> Optional[Dict]:
        """
        Extract watering factor from factors list.
        
        Args:
            factors: List of factor calculation results
            
        Returns:
            Watering factor dict or None
        """
        for factor in factors:
            if 'WATERING' in factor.get('factor_code', ''):
                return factor
        return None
    
    def _should_create_alert(self, existing_alerts: List[Dict], plant_id: str) -> bool:
        """
        Determine if we should create a new alert.
        
        Don't create if:
        - Active alert already exists and is snoozed (before snooze_until)
        - Active alert exists and is within suppress_until period
        
        Args:
            existing_alerts: List of existing active alerts
            plant_id: UUID of plant
            
        Returns:
            Boolean - True if should create alert
        """
        today = date.today()
        
        # Check for snoozed alerts still within snooze period
        for alert in existing_alerts:
            if alert.get('is_snoozed') and alert.get('snooze_until'):
                snooze_until = date.fromisoformat(alert['snooze_until'])
                if today <= snooze_until:
                    return False  # Still snoozed
        
        # Check for dismissed alerts with active suppression
        dismissed_response = (self.supabase
                             .table('plant_alerts')
                             .select('alert_id, suppress_until')
                             .eq('plant_id', plant_id)
                             .eq('is_dismissed', True)
                             .gte('suppress_until', today.isoformat())
                             .execute())
        
        if dismissed_response.data:
            return False  # Still suppressed from dismiss
        
        return True
    
    def _create_watering_alert(
        self,
        plant_id: str,
        plant_name: str,
        status_code: str,
        severity: int,
        factor: Dict
    ) -> None:
        """
        Create a new watering alert.
        
        Args:
            plant_id: UUID of plant
            plant_name: Name for display
            status_code: Current status code
            severity: Severity level (1-3)
            factor: Watering factor result dict
        """
        # Map severity to alert severity
        severity_map = {
            1: 'LOW',
            2: 'MEDIUM',
            3: 'HIGH'
        }
        alert_severity = severity_map.get(severity, 'MEDIUM')
        
        # Extract target date from factor
        target_date = factor.get('target_date')
        if target_date:
            target_date = date.fromisoformat(target_date)
        else:
            target_date = date.today()
        
        # Create alert title and message
        title = f"{plant_name} needs watering"
        message = factor.get('message', 'Watering is due')
        
        # Create alert record
        alert_data = {
            'plant_id': plant_id,
            'alert_type': 'WATERING_DUE',
            'alert_category': 'CARE',
            'severity': alert_severity,
            'title': title,
            'message': message,
            'target_date': target_date.isoformat(),
            'due_date': date.today().isoformat(),
            'source': 'CALCULATED',
            'calculation_run_id': str(self.calculation_run_id),
            'is_active': True,
            'is_snoozed': False,
            'is_dismissed': False
        }
        
        try:
            response = (self.supabase
                       .table('plant_alerts')
                       .insert(alert_data)
                       .execute())
            
            print(f"    🔔 Alert created: {title}")
            print(f"       Message: {message}")
            print(f"       Severity: {alert_severity}")
            
        except Exception as e:
            print(f"    ❌ Error creating alert: {str(e)}")
    
    def _resolve_alerts(self, alerts: List[Dict], reason: str = "resolved") -> None:
        """
        Resolve (mark as inactive) existing alerts.
        
        Args:
            alerts: List of alert dicts to resolve
            reason: Reason for resolution
        """
        alert_ids = [alert['alert_id'] for alert in alerts]
        
        (self.supabase
         .table('plant_alerts')
         .update({
             'is_active': False,
             'resolved_at': date.today().isoformat(),
             'dismiss_type': reason
         })
         .in_('alert_id', alert_ids)
         .execute())
    
    def handle_user_snooze(
        self,
        alert_id: str,
        snooze_days: int
    ) -> Dict:
        """
        Handle user snooze action.
        
        Enforces one-snooze-only rule:
        - If alert already snoozed, return error
        - Otherwise, set snooze parameters
        
        Args:
            alert_id: UUID of alert to snooze
            snooze_days: Number of days to snooze (1-3)
            
        Returns:
            Dict with success status and message
        """
        # Validate snooze days
        if snooze_days < 1 or snooze_days > 3:
            return {
                'success': False,
                'message': 'Snooze days must be between 1 and 3'
            }
        
        # Get alert
        response = (self.supabase
                   .table('plant_alerts')
                   .select('*')
                   .eq('alert_id', alert_id)
                   .single()
                   .execute())
        
        alert = response.data
        
        # Check if already snoozed (one-snooze-only rule)
        if alert.get('is_snoozed'):
            return {
                'success': False,
                'message': 'This alert has already been snoozed. Please water the plant or dismiss with a new date.'
            }
        
        # Calculate snooze_until date
        snooze_until = date.today() + timedelta(days=snooze_days)
        
        # Update alert
        (self.supabase
         .table('plant_alerts')
         .update({
             'is_snoozed': True,
             'snooze_days': snooze_days,
             'snooze_until': snooze_until.isoformat()
         })
         .eq('alert_id', alert_id)
         .execute())
        
        return {
            'success': True,
            'message': f'Alert snoozed until {snooze_until.isoformat()}',
            'snooze_until': snooze_until.isoformat()
        }
    
    def handle_user_dismiss(
        self,
        alert_id: str,
        override_date: date
    ) -> Dict:
        """
        Handle user dismiss with override date.
        
        User is saying: "I know better - next watering should be on this date"
        This becomes the new target for future calculations.
        
        Args:
            alert_id: UUID of alert to dismiss
            override_date: Date user wants as new target
            
        Returns:
            Dict with success status and message
        """
        # Validate override date is in future
        if override_date <= date.today():
            return {
                'success': False,
                'message': 'Override date must be in the future'
            }
        
        # Update alert
        (self.supabase
         .table('plant_alerts')
         .update({
             'is_dismissed': True,
             'dismissed_at': date.today().isoformat(),
             'dismiss_type': 'USER_OVERRIDE',
             'suppress_until': override_date.isoformat(),
             'target_date': override_date.isoformat()  # Update target
         })
         .eq('alert_id', alert_id)
         .execute())
        
        return {
            'success': True,
            'message': f'Alert dismissed. New target date: {override_date.isoformat()}',
            'target_date': override_date.isoformat()
        }
    
    def handle_watering_completed(self, alert_id: str, plant_id: str) -> Dict:
        """
        Handle when user waters the plant (marks alert as done).
        
        This should:
        1. Log the watering activity
        2. Resolve the alert
        3. Trigger status recalculation
        
        Args:
            alert_id: UUID of alert
            plant_id: UUID of plant
            
        Returns:
            Dict with success status
        """
        # Log watering activity
        activity_data = {
            'plant_id': plant_id,
            'activity_type_code': 'WATERING',
            'activity_date': date.today().isoformat(),
            'user_timezone': 'America/New_York'  # TODO: Get from user settings
        }
        
        (self.supabase
         .table('plant_activity_history')
         .insert(activity_data)
         .execute())
        
        # Resolve alert
        (self.supabase
         .table('plant_alerts')
         .update({
             'is_active': False,
             'resolved_at': date.today().isoformat(),
             'dismiss_type': 'MARKED_DONE'
         })
         .eq('alert_id', alert_id)
         .execute())
        
        return {
            'success': True,
            'message': 'Watering logged and alert resolved'
        }


def main():
    """
    Test alert management independently.
    In production, this is called by status_calculation.py
    """
    manager = AlertManager()
    
    # Example: Process alerts for a test plant
    test_plant_id = "your-test-plant-id"
    test_factors = [{
        'factor_code': 'WATERING_ATTENTION',
        'severity': 1,
        'message': 'Watering overdue by 2 days',
        'target_date': '2025-01-18'
    }]
    
    manager.process_alerts_for_plant(
        plant_id=test_plant_id,
        plant_name="Test Plant",
        status_code="attention",
        effective_severity=1,
        factors=test_factors,
        calculation_run_id=str(uuid.uuid4())
    )


if __name__ == "__main__":
    main()