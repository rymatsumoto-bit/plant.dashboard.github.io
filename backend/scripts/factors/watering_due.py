"""
WATERING_DUE.PY - Watering Due Factor Manager
"""

import pandas as pd
import numpy as np
import uuid

def run(plants_data_df, activity_data_df, run_id):
    print(f"\nManaging watering due factor for run {run_id}...\n")

    """
    Main managing method for watering due factor.
    
    Phase 1 Logic:
    - Get last watering date from activity history
    - Get expected interval from plant type (species average)
    - Calculate days overdue
    - Map to severity level
    - Calculate confidence score
    
    Management
    - Checks if there's an active factor (due date)
    --- If no, adds the new one
    --- If yes, do nothing

    Plant Status Contribution
    - Checks if there's an active factor (due date)
    --- If no, adds the new one
    --- If yes, do nothing
    
    Args:
        plant_detail
            - plant_id
            - plant_type_id
            - acquisition_date
        plant_activity
            - plant_id
            - activity_date
            - activity_id = watering
    Returns:
        plant_factor_df 
            - plant_factor_id
            - plant_id
            - factor_code: str
            - factor_date: date
            - factor_float
            - confidence_score: float (0.0-1.0)
    """

    # Step 01: calculate days between each watering per plant
    activity_history_df = activity_data_df.sort_values(['plant_id', 'activity_date'])
    activity_history_df['days_since_last'] = activity_history_df.groupby('plant_id')['activity_date'].diff().dt.days
    print(f"  ✅ Step 01")

    # Step 02: Gets last watering date, watering count, average days between watering
    last_watering = activity_history_df.groupby('plant_id').agg(
        last_watering_date=('activity_date','max'),
        watering_count=('activity_date','count'),
        average_watering=('days_since_last','mean')
    ).reset_index()
    print(f"  ✅ Step 02")

    # Step 03: Merge to main table
    df = plants_data_df.merge(last_watering, on='plant_id', how='left')
    print(f"  ✅ Step 03")

    # Step 04: Calculate next watering date
    df['watering_due_date'] = np.select(
    condlist=[
        df['last_watering_date'].isna(),    # Condition 1: no history
        df['watering_count'] < 5,           # Condition 2: history too short
        df['watering_count'] >= 5           # Condition 3: has enough history
    ],
    choicelist=[
        df['acquisition_date'] + pd.to_timedelta(df['watering_interval_days'], unit='D'),   # Acquisition date + plant type average days
        df['last_watering_date'] + pd.to_timedelta(df['watering_interval_days'], unit='D'), # Last watering date + plant type average days
        df['last_watering_date'] + pd.to_timedelta(df['average_watering'], unit='D')        # Last watering date + plant type average days
    ],
    default=df['acquisition_date'] + pd.to_timedelta(df['watering_interval_days'], unit='D')
    )
    print(f"  ✅ Step 04")

    # Step 05: Calculate confidence
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
    
    df['confidence_score'] = df['watering_count'].apply(calc_confidence)
    # Phase 1: Cap at 0.7 (using species default)
    df['confidence_score'] = np.minimum(df['confidence_score'], 0.7)
    df['confidence_score'] = df['confidence_score'].round(2)
    print(f"  ✅ Step 05")

    # Step 06: Create data to upload
    ## Get calculated values
    keep_cols = ['plant_id', 'watering_due_date', 'confidence_score']
    rename_map = {'watering_due_date': 'factor_date'}
    plant_factor_df = df[keep_cols].rename(columns=rename_map)
    ## Formats data
    ### Converts plant_id UUID as string
    ### Use %Y-%m-%d for 'DATE' columns (removes the time component)
    plant_factor_df['factor_date'] = plant_factor_df['factor_date'].dt.strftime('%Y-%m-%d')
    plant_factor_df['factor_date'] = pd.to_datetime(plant_factor_df['factor_date'])
    ## Add factor code
    plant_factor_df['factor_code'] = 'watering_due'
    ## Create factor id
    plant_factor_df['plant_factor_id'] = [str(uuid.uuid4()) for _ in range(len(plant_factor_df))]
    ## Replace NaT/NaN with None so Supabase receives a SQL NULL
    plant_factor_df = plant_factor_df.where(pd.notnull(plant_factor_df), None)
    print(f"  ✅ Step 06")

    print(f"\n  ✅ Watering due factor finished\n")
    return plant_factor_df