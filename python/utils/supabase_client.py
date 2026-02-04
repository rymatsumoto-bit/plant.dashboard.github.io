"""
Supabase Client Module
Provides a reusable connection to the Supabase database.
Import this module in other scripts to access the database.
"""

from supabase import create_client, Client
import os

# Supabase Configuration
# Replace these with your actual credentials
SUPABASE_URL = "https://dciowholtqcpgzpryush.supabase.co"
# SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaW93aG9sdHFjcGd6cHJ5dXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1Mzg2MDQsImV4cCI6MjA4MDExNDYwNH0.UdNGgOT_mpDrFQXjQp7XB6F0Bbdn-eGJi9mcjz-ZnIw"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaW93aG9sdHFjcGd6cHJ5dXNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDUzODYwNCwiZXhwIjoyMDgwMTE0NjA0fQ.nZlL6YECtZ0dq2N5V4fs7WI2gWM0fRsDPxBe55NuDHA"

# Alternative: Use environment variables (more secure for production)
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")

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
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
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