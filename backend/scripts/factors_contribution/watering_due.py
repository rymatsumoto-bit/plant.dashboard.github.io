"""
WATERING_DUE.PY - Watering Due Factor Manager
"""

from datetime import date
import pandas as pd
import numpy as np
import uuid

def run(plant_factor_df, run_id):
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

    Args:
        plant_factor_df 
            - plant_id: str
            - plant_factor_id
            - factor_code: str
            - factor_date: date
            - confidence: float (0.0-1.0)
    Returns:
        plant_factor_contribution_df
            - plant_factor_contribution_id: str
            - plant_factor_id
            - plant_id: str
            - factor_code: str
            - severity: int

    """

    # Step 01: Get run date
    today = pd.Timestamp(date.today())
    print(f"  ✅ Step 01")

    # Step 02: Calculate days
    plant_factor_df['days_overdue'] = (today - plant_factor_df['factor_date']).dt.days
    print(f"  ✅ Step 02")

    # Step 03: Establish severity thresholds
    """
    Thresholds:
    - HEALTHY: days_overdue <= 0
    - ATTENTION: 1-2 days overdue
    - WARNING: 3-6 days overdue
    - URGENT: 7+ days overdue
    """
    severity_conditions = [
        plant_factor_df['days_overdue'].isna(),
        plant_factor_df['days_overdue'] <=0,
        (plant_factor_df['days_overdue'] >=1) & (plant_factor_df['days_overdue'] <=2),
        (plant_factor_df['days_overdue'] >=3) & (plant_factor_df['days_overdue'] <=6),
        plant_factor_df['days_overdue'] >=7
    ]
    severity = [0,0,1,2,3]
    print(f"  ✅ Step 03")

    # Step 04: Assign severity
    plant_factor_df['severity'] = np.select(severity_conditions,severity,default=0)
    print(f"  ✅ Step 04")

    # Step 05: Create data to return
    ## Keep only needed data
    keep_cols = ['plant_factor_id', 'plant_id', 'factor_code', 'severity']
    plant_factor_df = plant_factor_df[keep_cols]
    plant_factor_df['plant_factor_contribution_id'] = [uuid.uuid4() for _ in range(len(plant_factor_df))]
    ## Replace NaT/NaN with None so Supabase receives a SQL NULL
    plant_factor_contribution_df = plant_factor_df.where(pd.notnull(plant_factor_df), None)
    print(f"  ✅ Step 05")
    
    print(f"\n  ✅ Watering due factor contribution finished\n")

    return plant_factor_contribution_df    