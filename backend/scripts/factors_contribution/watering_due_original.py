"""
WATERING_DUE.PY - Watering Due Factor Manager
"""

from datetime import date
import pandas as pd
import numpy as np

def run(run_id, supabase):
    print(f"\nManaging watering due factor contribution for run {run_id}...\n")

    """
    Main managing method for watering due factor contribution.
    
    Phase 1 Logic:
    - Uses distance (in days) to calculate severity
    
    Severity
    - 0: not overdue
    - 1: 1-2 days overdue
    - 2: 3-6 days overdue
    - 3: 7+ days overdue

    """

    # Step 01: Get active factors
    factors_data_df = _get_active_factors(supabase)
    print(f"  ✅ Step 01")

    # Step 02: Get run date
    today = pd.Timestamp(date.today())
    print(f"  ✅ Step 02")

    # Step 03: Calculate days
    factors_data_df['days_overdue'] = (today - factors_data_df['factor_date']).dt.days
    print(f"  ✅ Step 03")

    # Step 04: Establish severity thresholds
    """
    Thresholds:
    - HEALTHY: days_overdue <= 0
    - ATTENTION: 1-2 days overdue
    - WARNING: 3-5 days overdue
    - URGENT: 6+ days overdue
    """
    severity_conditions = [
        factors_data_df['days_overdue'].isna(),
        factors_data_df['days_overdue'] <=0,
        (factors_data_df['days_overdue'] >=1) & (factors_data_df['days_overdue'] <=2),
        (factors_data_df['days_overdue'] >=3) & (factors_data_df['days_overdue'] <=6),
        factors_data_df['days_overdue'] >=7
    ]
    severity = [0,0,1,2,3]
    print(f"  ✅ Step 04")

    # Step 05: Assign severity
    factors_data_df['severity'] = np.select(severity_conditions,severity,default=0)
    print(f"  ✅ Step 05")

    # Step 06: Create data to upload
    ## Keep only needed data
    keep_cols = ['plant_factor_id', 'plant_id', 'factor_code', 'severity']
    factors_data_df = factors_data_df[keep_cols]

    ## Add batch id
    factors_data_df['batch_id'] = str(run_id)
    ## Replace NaT/NaN with None so Supabase receives a SQL NULL
    factors_data_df = factors_data_df.where(pd.notnull(factors_data_df), None)
    print(f"  ✅ Step 06")

    # Step 07: Save to database
    factor_upload_df = factors_data_df.to_dict(orient="records")
    (supabase
        .table('plant_factor_contribution_history')
        .insert(factor_upload_df)
        .execute())
    print(f"  ✅ Step 07")

    # Step 08: Fecth active factor contributions
    factor_active_df = _get_active_factor_contributions(supabase)
    print(f"  ✅ Step 08")
    
    # Step 09: Remove plants that have an active factor
    factors_data_df = factors_data_df[~factors_data_df['plant_id'].isin(factor_active_df['plant_id'])]
    print(f"  ✅ Step 09")
    
    # Step 10: Add the new factors
    if factors_data_df.empty:
        print(f"  ✅ Step 10: no new contribution")
    else:
        plant_new_factor_contribution_upload_df = factors_data_df.to_dict(orient="records")
        (supabase
            .table('plant_factor_contribution_active')
            .insert(plant_new_factor_contribution_upload_df)
            .execute())
    print(f"  ✅ Step 10")
    
    print(f"\n  ✅ Watering due factor contribution finished\n")

"""
--------------------------------------------
SUPPORT FUNCTIONS
--------------------------------------------
"""

def _get_active_factors(supabase) -> pd.DataFrame:
    """
    Get active factors

    Returns:
        DataFrame with columns [plant_factor_id, plant_id, factor_date]
    """

    response = (supabase
                .table('plant_factor_active')
                .select('plant_factor_id, plant_id, factor_code, factor_date')
                .eq('factor_code','watering_due')
                .eq('is_active',True)
                .execute())
    df = pd.DataFrame(response.data)
    df['plant_factor_id'] = df['plant_factor_id'].astype(str)
    df['plant_id'] = df['plant_id'].astype(str)
    df['factor_date'] = pd.to_datetime(df['factor_date'])

    return df


def _get_active_factor_contributions(supabase) -> pd.DataFrame:
    """
    Get active due watering factors contributions

    Returns:
        DataFrame with columns [plant_id]
    """
    response = (supabase
                .table('plant_factor_contribution_active')
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