from supabase import create_client, Client

# Replace these with your actual credentials
SUPABASE_URL = "https://dciowholtqcpgzpryush.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaW93aG9sdHFjcGd6cHJ5dXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1Mzg2MDQsImV4cCI6MjA4MDExNDYwNH0.UdNGgOT_mpDrFQXjQp7XB6F0Bbdn-eGJi9mcjz-ZnIw"

def get_supabase_client() -> Client:
    """Initialize and return Supabase client"""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase

# Test the connection
if __name__ == "__main__":
    try:
        supabase = get_supabase_client()
        print("✓ Connected to Supabase successfully!")
        
        # Try to fetch plants
        response = supabase.table("plants").select("*").execute()
        print(f"✓ Found {len(response.data)} plants in database")
        
    except Exception as e:
        print(f"✗ Error: {e}")