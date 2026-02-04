"""
Supabase Client Module
Provides a reusable connection to the Supabase database.
Import this module in other scripts to access the database.
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Supabase Configuration
# Replace these with your actual credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def get_client() -> Client:
    """
    Create and return a Supabase client instance for server-side scripts.
    Uses service_role key to bypass RLS.

    Returns:
        Client: Authenticated Supabase client
        
    Example:
        from supabase_client import get_client
        supabase = get_client()
        response = supabase.table("plants").select("*").execute()
    """
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        return supabase
    except Exception as e:
        print(f"Error creating Supabase client: {e}")
        raise

# Test connection when run directly
if __name__ == "__main__":
    try:
        client = get_client()
        print("✓ Supabase client created successfully!")
        print(f"✓ Connected to: {SUPABASE_URL}")
    except Exception as e:
        print(f"✗ Connection failed: {e}")