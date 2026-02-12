"""
STATUS_CALCULATION.PY - Main Status Orchestrator
Calculates plant status
Version 1.0.0
09 Feb 2026
"""
import pandas as pd
import numpy as np
import uuid

def run(factor_contribution_df, status_factor_contribution_map_df, run_id):
    print(f"\nManaging watering due factor for run {run_id}...\n")

    """
    Calculates plant statys
    
    Phase 1 Logic:
    - Weighted average of the severity of each factor contribution
    Args:
        plant_factor_contribution_df
            - plant_id: str
            - factor_code: str
            - severity: int
        status_factor_contribution_map_df
            - factor_code: str
            - weight: float (the sum of the weights in the table is 1)
    Returns:
        plant_status_df
            - plant_status_id: str        
            - plant_id: str
            - plant_status_code: int
    """

    # Step 01: join tables and calculate the weighted average
    plant_status_df = factor_contribution_df.merge(status_factor_contribution_map_df, on='factor_code', how='left')
    print(f"  ✅ Step 01")
    
    # Step 02: Custom function to handle weights per group
    def w_avg(group, values, weights):
        d = group[values]
        w = group[weights]
        if w.sum() == 0:
            return 0
        return (d * w).sum() / w.sum()
    print(f"  ✅ Step 02")

    # Step 03: calculates weighted averages
    weighted_series = plant_status_df.groupby('plant_id').apply(w_avg, 'severity', 'weight')
    print(f"  ✅ Step 03")

    # Step 04: Convert Series to DataFrame and name the column
    # We name it 'weighted_sev' temporarily to process it
    plant_status_df = weighted_series.reset_index(name='status_code')    
    print(f"  ✅ Step 04")

    # Step 05: Create 'severity' as a rounded integer
    plant_status_df['status_code'] = plant_status_df['status_code'].round(0).astype(int)
    print(f"  ✅ Step 05")

    ## Step 06: Add status id
    plant_status_df['plant_status_id'] = [str(uuid.uuid4()) for _ in range(len(plant_status_df))]
    print(f"  ✅ Step 05")
    
    return plant_status_df
