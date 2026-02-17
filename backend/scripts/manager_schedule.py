"""
MANAGER_SCHEDULE.PY - Schedule orchestrator
Manage schedule
Version 1.0.0
11 Feb 2026
"""
import pandas as pd
import numpy as np
import uuid
from scripts.schedule.severity import run as schedule_severity_calculator

def create_schedule(plant_factor_df, factor_lookup_df, today_date, run_id):
    print(f"\nManaging schedule for run {run_id}...\n")

    """
    Creates data to manage schedule
    
    Phase 1 Logic:
    - Create data if factor_code = watering
    Args:
        plant_factor_df 
            - plant_factor_id
            - plant_id
            - factor_code: str
            - factor_date: date
            - confidence_score: float (0.0-1.0)
        factor_lookup_df
            - factor_code
            - factor_category            
    Returns:
        schedule_df
            - schedule_id
            - plant_id: str
            - plant_factor_id: str
            - factor_code: str
            - schedule_date
            - schedule_label
            - schedule_severity
    """

    # Step 01: join tables
    schedule_df = plant_factor_df.merge(factor_lookup_df, on='factor_code', how='left')
    print(f"  ✅ Step 01")
    ## Create factor id
    schedule_df['schedule_id'] = [str(uuid.uuid4()) for _ in range(len(schedule_df))]
    # Step 02: rename columns
    rename_map = {
        'factor_category': 'schedule_label',
        'factor_date': 'schedule_date'
    }
    schedule_df = schedule_df.rename(columns=rename_map)
    print(f"  ✅ Step 02")
    
    # Step 03: calculate schedule_severity
    schedule_severity_df = schedule_severity_calculator(schedule_df,today_date,run_id)
    schedule_df = schedule_df.merge(schedule_severity_df, on='schedule_id', how='left')
    print(f"  ✅ Step 03")

    # Step 04: Create data to upload
    ## Get calculated values
    keep_cols = ['schedule_id', 'plant_factor_id','plant_id','factor_code','schedule_date','schedule_label','schedule_severity']
    schedule_df = schedule_df[keep_cols]
    ## Replace NaT/NaN with None so Supabase receives a SQL NULL
    schedule_df = schedule_df.where(pd.notnull(schedule_df), None)
    print(f"  ✅ Step 04")
    
    print(f"\n  ✅ Scheduling done\n")
    return schedule_df