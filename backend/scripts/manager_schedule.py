"""
MANAGER_SCHEDULE.PY - Schedule orchestrator
Manage schedule
Version 1.0.0
11 Feb 2026
"""
import pandas as pd
import numpy as np
import uuid

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

    # Step 02: calculate schedule_severity
    schedule_df['days_until'] = (today_date - schedule_df['factor_date']).dt.days
    print(f"  ✅ Step 01")

    # Step 03 Calculate schedule status
    schedule_df['schedule_severity'] = np.select(
        condlist=[
            schedule_df['days_until']<=0,   # Condition 1: schedule in the future
            schedule_df['days_until'] <= 2, # Condition 2: schedule is 2 days old
            schedule_df['days_until'] <= 6, # Condition 3: schedule is 6 days old
            schedule_df['days_until'] >= 7  # Condition 4: schedule is more than 7 days old
        ],
        choicelist=[
            0,  # healthy
            1,  # warning
            2,  # attention
            3,  # urgent
        ],
        default=0   # healthy
    )
    print(f"  ✅ Step 03")

    # Step 04: Create data to upload
    ## Get calculated values
    keep_cols = ['plant_factor_id','plant_id','factor_code''factor_date','factor_category','schedule_severity']
    rename_map = {
        'factor_category': 'schedule_label',
        'factor_date': 'schedule_date'
        }
    schedule_df = schedule_df[keep_cols].rename(columns=rename_map)
    ## Create factor id
    schedule_df['schedule_id'] = [uuid.uuid4() for _ in range(len(schedule_df))]
    ## Replace NaT/NaN with None so Supabase receives a SQL NULL
    schedule_df = schedule_df.where(pd.notnull(schedule_df), None)
    print(f"  ✅ Step 04")
    
    print(f"\n  ✅ Scheduling done\n")
    return schedule_df
