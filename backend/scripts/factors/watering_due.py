"""
WATERING_DUE.PY - Watering Due Factor Manager
"""

import pandas as pd
import numpy as np

def run(run_id, supabase):
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
        plant: Dict with plant_id, plant_type_id, acquisition_date
        history: Dict with plant_id, activity_date, activity_id = watering        
    Returns:
        Dict with:
        - plant_id
        - factor_code: str
        - factor: date
        - confidence: float (0.0-1.0)
    """

    # Step 1: Get active plants
    plants_data_df = _get_active_plants(supabase)
    print(f"  ✅ Step 01")
    
    # Step 2: Get plant type plants
    plant_types_df = _get_plant_types(supabase)
    print(f"  ✅ Step 02")

    # Step 3: Merge default water interval
    df = plants_data_df.merge(plant_types_df, on='plant_type_id', how='left')
    print(f"  ✅ Step 03")

    # Step 4: Gets historical data
    activity_history_df = _get_activity_history(supabase)
    print(f"  ✅ Step 04")

    # Step 5: days between each watering per plant
    activity_history_df = activity_history_df.sort_values(['plant_id', 'activity_date'])
    activity_history_df['days_since_last'] = activity_history_df.groupby('plant_id')['activity_date'].diff().dt.days
    print(f"  ✅ Step 05")

    # Step 6: Gets last watering date, watering count, average days between watering
    last_watering = activity_history_df.groupby('plant_id').agg(
        last_watering_date=('activity_date','max'),
        watering_count=('activity_date','count'),
        average_watering=('days_since_last','mean')
    ).reset_index()
    print(f"  ✅ Step 06")

    # Step 7: Merge to main table
    df = df.merge(last_watering, on='plant_id', how='left')
    print(f"  ✅ Step 07")

    # Step 8: Calculate next watering date
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
    print(f"  ✅ Step 08")

    # Step 9: Calculate confidence
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
    print(f"  ✅ Step 09")

    # Step 10: Create data to upload
    ## Get calculated values
    keep_cols = ['plant_id', 'watering_due_date', 'confidence_score']
    rename_map = {'watering_due_date': 'factor_date'}
    plant_factor_df = df[keep_cols].rename(columns=rename_map)
    ## Formats data
    ### Converts plant_id UUID as string
    ### Use %Y-%m-%d for 'DATE' columns (removes the time component)
    plant_factor_df['factor_date'] = plant_factor_df['factor_date'].dt.strftime('%Y-%m-%d')
    ## Add factor code and batch id
    plant_factor_df['factor_code'] = 'watering_due'
    plant_factor_df['batch_id'] = str(run_id)
    ## Replace NaT/NaN with None so Supabase receives a SQL NULL
    plant_factor_df = plant_factor_df.where(pd.notnull(plant_factor_df), None)
    print(f"  ✅ Step 10")

    # Step 11: Save calcualted to database
    plant_factor_upload_df = plant_factor_df.to_dict(orient="records")
    (supabase
        .table('plant_factor_history')
        .insert(plant_factor_upload_df)
        .execute())
    print(f"  ✅ Step 11")

    # Step 12: Fecth active factors
    factor_active_df = _get_active_factor(supabase)
    print(f"  ✅ Step 12")

    # Step 13: Remove plants that have an active factor
    plant_factor_df = plant_factor_df[~plant_factor_df['plant_id'].isin(factor_active_df['plant_id'])]
    print(f"  ✅ Step 13")

    # Step 14: Add the new factors
    if plant_factor_df.empty:
        print(f"  ✅ Step 14: no new factors")
    else:
        plant_new_factor_upload_df = plant_factor_df.to_dict(orient="records")
        (supabase
            .table('plant_factor_active')
            .insert(plant_new_factor_upload_df)
            .execute())
    print(f"  ✅ Step 14")

    print(f"\n  ✅ Watering due factor finished\n")

"""
--------------------------------------------
SUPPORT FUNCTIONS
--------------------------------------------
"""

def _get_active_plants(supabase) -> pd.DataFrame:
    """
    Get active plants

    Returns:
        DataFrame with columns [plant_id, plant_type_id, habitat_id, acquisition_date, user_timezone]
    """

    response = (supabase
                .table('plant')
                .select('plant_id, plant_type_id, habitat_id, acquisition_date, user_timezone')
                .eq('is_active',True)
                .execute())
    df = pd.DataFrame(response.data)
    df['plant_id'] = df['plant_id'].astype(str)
    df['plant_type_id'] = df['plant_type_id'].astype(str)
    df['habitat_id'] = df['habitat_id'].astype(str)
    df['acquisition_date'] = pd.to_datetime(df['acquisition_date'])

    return df


def _get_plant_types(supabase) -> pd.DataFrame:
    """
    Get plant type watering intervals (cached).

    Returns:
        DataFrame with columns [plant_type_id, watering_interval_days]
    """

    response = (supabase
                .table('plant_type_lookup')
                .select('plant_type_id, watering_interval_days')
                .execute())

    df = pd.DataFrame(response.data)
    df['plant_type_id'] = df['plant_type_id'].astype(str)
    df['watering_interval_days'] = pd.to_numeric(df['watering_interval_days'])

    return df


def _get_activity_history(supabase) -> pd.DataFrame:
    """
    Get watering activity history

    Returns:
        DataFrame with columns [plant_type_id, activity_date, quantifier]
    """
    response = (supabase
                .table('plant_activity_history')
                .select('plant_id, activity_date, quantifier')
                .eq('activity_type_code', 'watering')
                .order('plant_id', desc=False)
                .order('activity_date', desc=False)
                .execute())

    df = pd.DataFrame(response.data)
    df['plant_id'] = df['plant_id'].astype(str)
    df['activity_date'] = pd.to_datetime(df['activity_date'])
    df['quantifier'] = pd.to_numeric(df['quantifier'])

    return df


def _get_active_factor(supabase) -> pd.DataFrame:
    """
    Get active due watering factors

    Returns:
        DataFrame with columns [plant_id]
    """
    response = (supabase
                .table('plant_factor_active')
                .select('plant_id')
                .eq('factor_code', 'watering_due')
                .eq('is_active',True)
                .execute())

    # Check if data exists to avoid "list indices" errors
    if not response.data:
        # Return an empty DataFrame with the expected column
        return pd.DataFrame(columns=['plant_id'])

    df = pd.DataFrame(response.data)
    df['plant_id'] = df['plant_id'].astype(str)

    return df