"""
SEVERITY.PY - Schedule Severity Calculator
"""

import pandas as pd
import numpy as np

def run(schedule_df, today_date, run_id):
    print(f"\nCalculating schedule severity for run {run_id}...\n")

    """
    Calculates the severity of each schedule item
    
    Phase 1 Logic:
    - See table below
    Args:
        schedule_df
            - schedule_id
            - schedule_date
            -...
    Returns:
        schedule_severity_df
            - schedule_id
            - schedule_severity
    """

    # Step 01: days from today until schedule date
    schedule_df['days_until'] = (today_date - schedule_df['schedule_date']).dt.days
    print(f"  ✅ Step 01")

    # Step 02: Calculate schedule severity
    schedule_df['schedule_severity_new'] = np.select(
        condlist=[
            schedule_df['days_until'] <=0,   # Condition 1: schedule in the future
            schedule_df['days_until'].between(1,2, inclusive='both'), # Condition 2: schedule is 2 days old
            schedule_df['days_until'].between(3,6, inclusive='both'), # Condition 3: schedule is 6 days old
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
    print(f"  ✅ Step 02")

    # Step 03: Create data to return
    ## Get calculated values
    keep_cols = ['schedule_id','schedule_severity_new']
    rename_map = {'schedule_severity_new': 'schedule_severity'}
    severity_df = schedule_df[keep_cols].rename(columns=rename_map)
    ## Replace NaT/NaN with None so Supabase receives a SQL NULL
    severity_df = severity_df.where(pd.notnull(severity_df), None)
    print(f"  ✅ Step 03")
    
    print(f"\n  ✅ Schedule severity calculated.\n")
    return severity_df