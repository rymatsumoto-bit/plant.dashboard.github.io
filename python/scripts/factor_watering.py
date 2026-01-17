"""
FACTOR_WATERING.PY - Watering Schedule Factor Calculator
Phase 1: Simple calculation based on days since last watering vs species average.
Phase 2+: Will incorporate seasonal adjustments, habitat multipliers, event detection.
"""

from datetime import date, timedelta
from typing import Dict, Optional, List
from decimal import Decimal


class WateringFactor:
    """Calculate watering schedule factor for plant status"""
    
    def __init__(self, supabase_client):
        self.supabase = supabase_client
        self.factor_category = 'WATERING'
        self.default_weight = 1.0
    
    def calculate(self, plant: Dict) -> Optional[Dict]:
        """
        Main calculation method for watering factor.
        
        Phase 1 Logic:
        - Get last watering date from activity history
        - Get expected interval from plant type (species average)
        - Calculate days overdue
        - Map to severity level
        - Calculate confidence score
        
        Args:
            plant: Dict with plant_id, plant_type_id, acquisition_date
            
        Returns:
            Dict with:
            - factor_code: str
            - severity: int (0-3)
            - confidence: float (0.0-1.0)
            - message: str (user-facing)
            - weight: float (for weighted combination)
            - target_date: date (calculated next watering date)
            Or None if cannot calculate
        """
        plant_id = plant['plant_id']
        plant_type_id = plant['plant_type_id']
        
        # Step 1: Get last watering date
        last_watering_date = self._get_last_watering_date(plant_id)
        
        if not last_watering_date:
            # No watering history - return None (can't calculate)
            print(f"    ⚠️  No watering history found")
            return None
        
        # Step 2: Get expected interval from species
        expected_interval = self._get_species_watering_interval(plant_type_id)
        
        if not expected_interval:
            print(f"    ⚠️  No species watering interval found")
            return None
        
        # Step 3: Calculate target date and days overdue
        target_date = last_watering_date + timedelta(days=expected_interval)
        today = date.today()
        days_overdue = (today - target_date).days
        
        print(f"    Last watered: {last_watering_date}")
        print(f"    Expected interval: {expected_interval} days")
        print(f"    Target date: {target_date}")
        print(f"    Days overdue: {days_overdue}")
        
        # Step 4: Map to severity and get factor code
        severity, factor_code = self._map_to_severity(days_overdue)
        
        # Step 5: Generate user message
        message = self._generate_message(days_overdue, factor_code)
        
        # Step 6: Calculate confidence score
        confidence = self._calculate_confidence(plant_id, expected_interval)
        
        print(f"    Factor: {factor_code} (Severity: {severity}, Confidence: {confidence:.2f})")
        
        return {
            'factor_code': factor_code,
            'severity': severity,
            'confidence': confidence,
            'message': message,
            'weight': self.default_weight,
            'target_date': target_date.isoformat()
        }
    
    def _get_last_watering_date(self, plant_id: str) -> Optional[date]:
        """
        Get the most recent watering date for this plant.
        
        Args:
            plant_id: UUID of plant
            
        Returns:
            date object or None if no watering history
        """
        response = (self.supabase
                   .table('plant_activity_history')
                   .select('activity_date')
                   .eq('plant_id', plant_id)
                   .eq('activity_type_code', 'watering')
                   .order('activity_date', desc=True)
                   .limit(1)
                   .execute())
        
        if response.data:
            # Parse date string to date object
            date_str = response.data[0]['activity_date']
            return date.fromisoformat(date_str)
        
        return None
    
    def _get_species_watering_interval(self, plant_type_id: str) -> Optional[int]:
        """
        Get expected watering interval from plant type lookup.
        
        Args:
            plant_type_id: UUID of plant type
            
        Returns:
            Integer days or None
        """
        response = (self.supabase
                   .table('plant_type_lookup')
                   .select('watering_interval_days')
                   .eq('plant_type_id', plant_type_id)
                   .single()
                   .execute())
        
        if response.data and response.data.get('watering_interval_days'):
            return int(response.data['watering_interval_days'])
        
        return None
    
    def _map_to_severity(self, days_overdue: int) -> tuple[int, str]:
        """
        Map days overdue to severity level and factor code.
        
        Thresholds (from status_factor_lookup):
        - HEALTHY: days_overdue <= 0
        - ATTENTION: 1-2 days overdue
        - WARNING: 3-5 days overdue
        - URGENT: 6+ days overdue
        
        Args:
            days_overdue: Integer (can be negative if ahead of schedule)
            
        Returns:
            Tuple of (severity: int, factor_code: str)
        """
        if days_overdue <= 0:
            return (0, 'WATERING_HEALTHY')
        elif days_overdue <= 2:
            return (1, 'WATERING_ATTENTION')
        elif days_overdue <= 5:
            return (2, 'WATERING_WARNING')
        else:
            return (3, 'WATERING_URGENT')
    
    def _generate_message(self, days_overdue: int, factor_code: str) -> str:
        """
        Generate user-facing message based on days overdue.
        
        Args:
            days_overdue: Integer
            factor_code: Current factor code
            
        Returns:
            String message
        """
        if days_overdue <= 0:
            days_until = abs(days_overdue)
            if days_until == 0:
                return "Watering due today"
            elif days_until == 1:
                return "Next watering due in 1 day"
            else:
                return f"Next watering due in {days_until} days"
        else:
            if days_overdue == 1:
                return "Watering overdue by 1 day"
            elif days_overdue <= 5:
                return f"Watering overdue by {days_overdue} days"
            else:
                return f"Critically overdue by {days_overdue} days - water immediately!"
    
    def _calculate_confidence(self, plant_id: str, expected_interval: int) -> float:
        """
        Calculate confidence score for this prediction.
        
        Phase 1 factors:
        - Data quantity: How many watering records exist
        - Data source: Using species default (lower confidence)
        
        Phase 2+ factors (future):
        - Data consistency: Variance in historical intervals
        - Time since last event: Repotting, habitat change
        - Seasonal alignment: Is calculation adjusted for season
        
        Args:
            plant_id: UUID of plant
            expected_interval: Days (for now, just species average)
            
        Returns:
            Float between 0.0 and 1.0
        """
        # Get count of watering activities
        response = (self.supabase
                   .table('plant_activity_history')
                   .select('activity_id', count='exact')
                   .eq('plant_id', plant_id)
                   .eq('activity_type_code', 'WATERING')
                   .execute())
        
        watering_count = response.count if response.count else 0
        
        # Base confidence on data quantity
        # 0-2 records: Low confidence (0.3-0.4)
        # 3-5 records: Medium confidence (0.5-0.6)
        # 6-10 records: Good confidence (0.7-0.8)
        # 10+ records: High confidence (0.9+)
        
        if watering_count == 0:
            confidence = 0.0  # No data at all
        elif watering_count <= 2:
            confidence = 0.3 + (watering_count * 0.05)
        elif watering_count <= 5:
            confidence = 0.5 + ((watering_count - 2) * 0.03)
        elif watering_count <= 10:
            confidence = 0.7 + ((watering_count - 5) * 0.02)
        else:
            confidence = min(0.95, 0.9 + ((watering_count - 10) * 0.01))
        
        # Phase 1: Using species default, so cap at 0.7 max
        # (We don't have plant-specific learned interval yet)
        confidence = min(confidence, 0.7)
        
        return round(confidence, 2)
    
    def _get_watering_history(self, plant_id: str, limit: int = 10) -> List[Dict]:
        """
        Get historical watering activities for this plant.
        
        Phase 2+: Will use this for weighted average calculation,
        variance analysis, seasonal pattern detection.
        
        Args:
            plant_id: UUID of plant
            limit: Maximum number of records to fetch
            
        Returns:
            List of activity dicts with dates
        """
        response = (self.supabase
                   .table('plant_activity_history')
                   .select('activity_id, activity_date')
                   .eq('plant_id', plant_id)
                   .eq('activity_type_code', 'WATERING')
                   .order('activity_date', desc=True)
                   .limit(limit)
                   .execute())
        
        return response.data if response.data else []
    
    def _calculate_weighted_interval(self, watering_dates: List[date]) -> int:
        """
        Calculate weighted average interval from historical waterings.
        
        Phase 2: Weight recent intervals more heavily.
        Example: Last 3 = 50%, Middle 3 = 30%, Older = 20%
        
        For now, this is a placeholder for future enhancement.
        
        Args:
            watering_dates: List of date objects, sorted desc
            
        Returns:
            Weighted average interval in days
        """
        # Placeholder for Phase 2
        # Will implement weighted calculation when we have seasonal adjustments
        pass
    
    def _detect_recent_events(self, plant_id: str, days_back: int = 30) -> Optional[Dict]:
        """
        Detect recent care events that might affect watering schedule.
        
        Phase 2: Check for:
        - Repotting (may increase interval temporarily)
        - Habitat change (different light/temp conditions)
        - Fertilizing (may affect water needs)
        
        Args:
            plant_id: UUID of plant
            days_back: How many days to look back
            
        Returns:
            Dict with event info or None
        """
        # Placeholder for Phase 2
        pass
    
    def _apply_seasonal_adjustment(
        self, 
        base_interval: int, 
        current_date: date
    ) -> int:
        """
        Apply seasonal multiplier to base watering interval.
        
        Phase 2: Adjust based on:
        - Season (summer = shorter, winter = longer)
        - Day length (longer days = more water)
        - Temperature trends
        
        Args:
            base_interval: Base days between watering
            current_date: Date to check season for
            
        Returns:
            Adjusted interval in days
        """
        # Placeholder for Phase 2
        pass
    
    def _apply_habitat_multiplier(
        self, 
        base_interval: int, 
        habitat_id: str
    ) -> int:
        """
        Apply habitat environmental multiplier.
        
        Phase 2: Adjust based on:
        - Temperature (higher = shorter interval)
        - Humidity (lower = shorter interval)
        - Light intensity (higher = more water needed)
        
        Args:
            base_interval: Base days between watering
            habitat_id: UUID of habitat
            
        Returns:
            Adjusted interval in days
        """
        # Placeholder for Phase 2
        pass