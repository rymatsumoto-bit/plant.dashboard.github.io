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
            - plant_status_code: str
    """

    # Step 01: join tables and calculate the weighted average
    plant_status_df = (factor_contribution_df.merge(status_factor_contribution_map_df, on='factor_code', how='left')
                .assign(weighted_sev = lambda x: x['severity'] * x['weight'])
                .groupby('plant_id')['weighted_sev']
                .sum()
                .reset_index())
    print(f"  ✅ Step 01")
    
    ## Add status id
    plant_status_df['plant_status_id'] = [uuid.uuid4() for _ in range(len(plant_status_df))]
    
    return plant_status_df
