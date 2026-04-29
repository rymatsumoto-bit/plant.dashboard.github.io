"""
FUNCTIONS.PY - Customized functions
Version 1.0.0
24 Apr 2026
"""

import pandas as pd
import json


def supabase_rpc_payload(df):
    if df is None or df.empty:
        return []  # 🔑 this is your "off switch"
    return json.loads(df.to_json(orient="records", date_format="iso"))