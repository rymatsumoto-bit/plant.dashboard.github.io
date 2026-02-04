"""
FACTOR_WATERING_PANDAS.PY - Watering Schedule Factor Calculator (Pandas/NumPy Version)
Phase 1: Simple calculation based on days since last watering vs species average.
Optimized for batch processing of multiple plants using vectorized operations.
"""

from datetime import date, timedelta
from typing import Dict, Optional, List
import pandas as pd
import numpy as np


class WateringFactorPandas:
    """Calculate watering schedule factor for plant status using pandas/numpy"""
    
    def __init__(self, supabase_client):
        self.supabase = supabase_client
        self.factor_category = 'WATERING'
        self.default_weight = 1.0
        
        # Cache for plant type data
        self._plant_types_cache = None
    
    def calculate_all(self, plants_df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate watering factors for all plants at once (vectorized).
        
        Args:
            plants_df: DataFrame with columns [plant_id, plant_type_id, acquisition_date]
            
        Returns:
            DataFrame with columns:
            - plant_id
            - factor_code
            - severity
            - confidence
            - message
            - weight
            - target_date
        """
        if plants_df.empty:
            return pd.DataFrame()
        
        print(f"\n{'='*60}")
        print(f"Processing {len(plants_df)} plants with pandas/numpy")
        print(f"{'='*60}\n")
        
        # Step 1: Get all watering history at once
        watering_df = self._get_all_last_waterings(plants_df['plant_id'].tolist())
        
        # Step 2: Get plant type intervals
        plant_types_df = self._get_plant_types()
        
        # Step 3: Merge data
        df = plants_df.merge(watering_df, on='plant_id', how='left')
        df = df.merge(plant_types_df, on='plant_type_id', how='left')
        
        # Step 4: Calculate target dates and days overdue (vectorized)
        df['target_date'] = pd.to_datetime(df['last_watering_date']) + pd.to_timedelta(df['watering_interval_days'], unit='D')
        today = pd.Timestamp(date.today())
        df['days_overdue'] = (today - df['target_date']).dt.days
        
        # Step 5: Map to severity (vectorized)
        df[['severity', 'factor_code']] = df['days_overdue'].apply(
            lambda x: pd.Series(self._map_to_severity(x))
        )
        
        # Step 6: Generate messages (vectorized)
        df['message'] = df.apply(
            lambda row: self._generate_message(row['days_overdue'], row['factor_code']),
            axis=1
        )
        
        # Step 7: Calculate confidence scores
        confidence_df = self._calculate_all_confidence(plants_df['plant_id'].tolist())
        df = df.merge(confidence_df, on='plant_id', how='left')
        df['confidence'] = df['confidence'].fillna(0.0)
        
        # Step 8: Add weight column
        df['weight'] = self.default_weight
        
        # Step 9: Filter out plants with no watering history
        valid_df = df[df['last_watering_date'].notna()].copy()
        
        # Convert target_date to string for JSON serialization
        valid_df['target_date'] = valid_df['target_date'].dt.date.astype(str)
        
        # Select final columns
        result_df = valid_df[[
            'plant_id', 'factor_code', 'severity', 'confidence', 
            'message', 'weight', 'target_date'
        ]]
        
        print(f"\n✅ Processed {len(result_df)} plants successfully")
        print(f"⚠️  Skipped {len(plants_df) - len(result_df)} plants (no watering history)\n")
        
        return result_df
    
    def calculate(self, plant: Dict) -> Optional[Dict]:
        """
        Calculate watering factor for a single plant (backwards compatible).
        Uses pandas internally for consistency.
        
        Args:
            plant: Dict with plant_id, plant_type_id, acquisition_date
            
        Returns:
            Dict with factor results or None if cannot calculate
        """
        # Convert single plant to DataFrame
        plants_df = pd.DataFrame([plant])
        
        # Use vectorized calculation
        result_df = self.calculate_all(plants_df)
        
        if result_df.empty:
            print(f"    ⚠️  No watering history found")
            return None
        
        # Convert back to dict
        result = result_df.iloc[0].to_dict()
        
        # Remove plant_id from result
        result.pop('plant_id', None)
        
        return result
    
    def _get_all_last_waterings(self, plant_ids: List[str]) -> pd.DataFrame:
        """
        Get the most recent watering date for multiple plants at once.
        
        Args:
            plant_ids: List of plant UUIDs
            
        Returns:
            DataFrame with columns [plant_id, last_watering_date, watering_count]
        """
        # Fetch all watering activities for these plants
        response = (self.supabase
                   .table('plant_activity_history')
                   .select('plant_id, activity_date')
                   .eq('activity_type_code', 'watering')
                   .in_('plant_id', plant_ids)
                   .order('activity_date', desc=True)
                   .execute())
        
        if not response.data:
            return pd.DataFrame(columns=['plant_id', 'last_watering_date', 'watering_count'])
        
        # Convert to DataFrame
        df = pd.DataFrame(response.data)
        df['activity_date'] = pd.to_datetime(df['activity_date'])
        
        # Get last watering per plant and count
        last_watering = df.groupby('plant_id').agg(
            last_watering_date=('activity_date', 'max'),
            watering_count=('activity_date', 'count')
        ).reset_index()
        
        return last_watering
    
    def _get_plant_types(self) -> pd.DataFrame:
        """
        Get plant type watering intervals (cached).
        
        Returns:
            DataFrame with columns [plant_type_id, watering_interval_days]
        """
        if self._plant_types_cache is not None:
            return self._plant_types_cache
        
        response = (self.supabase
                   .table('plant_type_lookup')
                   .select('plant_type_id, watering_interval_days')
                   .execute())
        
        df = pd.DataFrame(response.data)
        df['watering_interval_days'] = pd.to_numeric(df['watering_interval_days'])
        
        # Cache for future use
        self._plant_types_cache = df
        
        return df
    
    def _map_to_severity(self, days_overdue: int) -> tuple[int, str]:
        """
        Map days overdue to severity level and factor code.
        
        Thresholds:
        - HEALTHY: days_overdue <= 0
        - ATTENTION: 1-2 days overdue
        - WARNING: 3-5 days overdue
        - URGENT: 6+ days overdue
        
        Args:
            days_overdue: Integer (can be negative if ahead of schedule)
            
        Returns:
            Tuple of (severity: int, factor_code: str)
        """
        if pd.isna(days_overdue):
            return (0, 'WATERING_HEALTHY')
        
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
        if pd.isna(days_overdue):
            return "No watering data available"
        
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
    
    def _calculate_all_confidence(self, plant_ids: List[str]) -> pd.DataFrame:
        """
        Calculate confidence scores for multiple plants at once.
        
        Args:
            plant_ids: List of plant UUIDs
            
        Returns:
            DataFrame with columns [plant_id, confidence]
        """
        # Get watering counts per plant
        response = (self.supabase
                   .table('plant_activity_history')
                   .select('plant_id, activity_id')
                   .eq('activity_type_code', 'WATERING')
                   .in_('plant_id', plant_ids)
                   .execute())
        
        if not response.data:
            return pd.DataFrame({
                'plant_id': plant_ids,
                'confidence': 0.0
            })
        
        # Convert to DataFrame and count
        df = pd.DataFrame(response.data)
        counts_df = df.groupby('plant_id').size().reset_index(name='watering_count')
        
        # Vectorized confidence calculation using numpy
        def calc_confidence(count):
            if count == 0:
                return 0.0
            elif count <= 2:
                return 0.3 + (count * 0.05)
            elif count <= 5:
                return 0.5 + ((count - 2) * 0.03)
            elif count <= 10:
                return 0.7 + ((count - 5) * 0.02)
            else:
                return min(0.95, 0.9 + ((count - 10) * 0.01))
        
        counts_df['confidence'] = counts_df['watering_count'].apply(calc_confidence)
        
        # Phase 1: Cap at 0.7 (using species default)
        counts_df['confidence'] = np.minimum(counts_df['confidence'], 0.7)
        counts_df['confidence'] = counts_df['confidence'].round(2)
        
        # Ensure all plants are represented
        all_plants_df = pd.DataFrame({'plant_id': plant_ids})
        result_df = all_plants_df.merge(counts_df[['plant_id', 'confidence']], 
                                        on='plant_id', how='left')
        result_df['confidence'] = result_df['confidence'].fillna(0.0)
        
        return result_df
    
    # ============================================
    # PHASE 2+ METHODS (Placeholders)
    # ============================================
    
    def _calculate_weighted_intervals(self, watering_history_df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate weighted average intervals from historical waterings.
        
        Phase 2: Weight recent intervals more heavily using pandas.
        
        Args:
            watering_history_df: DataFrame with plant_id and activity_date
            
        Returns:
            DataFrame with plant_id and weighted_interval
        """
        # Placeholder for Phase 2
        pass
    
    def _detect_recent_events(self, plant_ids: List[str], days_back: int = 30) -> pd.DataFrame:
        """
        Detect recent care events for multiple plants.
        
        Phase 2: Check for repotting, habitat changes, fertilizing.
        
        Args:
            plant_ids: List of plant UUIDs
            days_back: How many days to look back
            
        Returns:
            DataFrame with plant_id and event information
        """
        # Placeholder for Phase 2
        pass
    
    def _apply_seasonal_adjustments(self, intervals_df: pd.DataFrame) -> pd.DataFrame:
        """
        Apply seasonal multipliers to watering intervals (vectorized).
        
        Phase 2: Adjust based on season, day length, temperature.
        
        Args:
            intervals_df: DataFrame with base_interval and current_date
            
        Returns:
            DataFrame with adjusted_interval
        """
        # Placeholder for Phase 2
        pass
    
    def _apply_habitat_multipliers(self, intervals_df: pd.DataFrame, habitats_df: pd.DataFrame) -> pd.DataFrame:
        """
        Apply habitat environmental multipliers (vectorized).
        
        Phase 2: Adjust based on temperature, humidity, light intensity.
        
        Args:
            intervals_df: DataFrame with base_interval and habitat_id
            habitats_df: DataFrame with habitat environmental data
            
        Returns:
            DataFrame with adjusted_interval
        """
        # Placeholder for Phase 2
        pass


# ============================================
# EXAMPLE USAGE
# ============================================

def example_usage():
    """Demonstrate both single-plant and batch processing"""
    from utils.supabase_client import get_client
    
    supabase = get_client()
    calculator = WateringFactorPandas(supabase)
    
    # Example 1: Single plant (backwards compatible)
    plant = {
        'plant_id': 'some-uuid',
        'plant_type_id': 'some-type-uuid',
        'acquisition_date': '2024-01-01'
    }
    result = calculator.calculate(plant)
    print("Single plant result:", result)
    
    # Example 2: Batch processing (much faster for multiple plants)
    plants_df = pd.DataFrame([
        {'plant_id': 'uuid-1', 'plant_type_id': 'type-1', 'acquisition_date': '2024-01-01'},
        {'plant_id': 'uuid-2', 'plant_type_id': 'type-2', 'acquisition_date': '2024-02-01'},
        {'plant_id': 'uuid-3', 'plant_type_id': 'type-1', 'acquisition_date': '2024-03-01'},
    ])
    results_df = calculator.calculate_all(plants_df)
    print("\nBatch results:")
    print(results_df)


if __name__ == "__main__":
    example_usage()