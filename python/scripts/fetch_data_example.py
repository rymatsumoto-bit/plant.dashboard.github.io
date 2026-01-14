"""
Fetch Data Example
Demonstrates how to use the supabase_client module to fetch data from the database.
"""

from ..utils.supabase_client import get_client
from datetime import datetime

def fetch_all_plants():
    """Fetch all plants from the database"""
    print("\n--- Fetching All Plants ---")
    supabase = get_client()
    
    response = supabase.table("plant").select("*").execute()
    
    print(f"Found {len(response.data)} plants:")
    for plant in response.data:
        print(f"  - {plant.get('plant_name', 'Unnamed')} (ID: {plant.get('plant_id')})")
    
    return response.data

def fetch_plant_inventory():
    """Fetch plants using the inventory view"""
    print("\n--- Fetching Plant Inventory (View) ---")
    supabase = get_client()
    
    response = supabase.table("plant_inventory_view").select("*").execute()
    
    print(f"Found {len(response.data)} plants in inventory:")
    for plant in response.data:
        name = plant.get('plant_name', 'Unnamed')
        status = plant.get('status_label', 'Unknown')
        habitat = plant.get('habitat', 'No habitat')
        print(f"  - {name}: {status} (Location: {habitat})")
    
    return response.data

def fetch_habitats():
    """Fetch all habitats"""
    print("\n--- Fetching All Habitats ---")
    supabase = get_client()
    
    response = supabase.table("habitat").select("*").eq("is_active", True).execute()
    
    print(f"Found {len(response.data)} active habitats:")
    for habitat in response.data:
        name = habitat.get('habitat_name', 'Unnamed')
        temp_controlled = "Climate controlled" if habitat.get('temperature_controlled') else "Natural climate"
        print(f"  - {name} ({temp_controlled})")
    
    return response.data

def fetch_recent_activities(limit=10):
    """Fetch recent plant care activities"""
    print(f"\n--- Fetching Last {limit} Activities ---")
    supabase = get_client()
    
    response = (supabase.table("plant_activity_history")
                .select("*, plant(plant_name)")
                .order("activity_date", desc=True)
                .limit(limit)
                .execute())
    
    print(f"Found {len(response.data)} recent activities:")
    for activity in response.data:
        plant_name = activity.get('plant', {}).get('plant_name', 'Unknown plant')
        activity_type = activity.get('activity_type_code', 'Unknown')
        date = activity.get('activity_date', 'Unknown date')
        print(f"  - {date}: {activity_type} on {plant_name}")
    
    return response.data

def fetch_plant_with_details(plant_id):
    """Fetch a specific plant with related data"""
    print(f"\n--- Fetching Plant Details (ID: {plant_id}) ---")
    supabase = get_client()
    
    # Fetch plant with habitat info
    response = (supabase.table("plant")
                .select("*, habitat(habitat_name), plant_type_lookup(species, category)")
                .eq("plant_id", plant_id)
                .single()
                .execute())
    
    plant = response.data
    print(f"Plant: {plant.get('plant_name')}")
    print(f"  Species: {plant.get('plant_type_lookup', {}).get('species', 'Unknown')}")
    print(f"  Category: {plant.get('plant_type_lookup', {}).get('category', 'Unknown')}")
    print(f"  Habitat: {plant.get('habitat', {}).get('habitat_name', 'No habitat')}")
    print(f"  Acquired: {plant.get('acquisition_date', 'Unknown')}")
    
    return plant

def main():
    """Run all example fetch operations"""
    print("=" * 50)
    print("SUPABASE DATA FETCH EXAMPLES")
    print("=" * 50)
    
    try:
        # Test connection
        supabase = get_client()
        print("✓ Connected to Supabase successfully!\n")
        
        # Fetch different types of data
        plants = fetch_all_plants()
        inventory = fetch_plant_inventory()
        habitats = fetch_habitats()
        activities = fetch_recent_activities(limit=5)
        
        # If we have plants, fetch details for the first one
        if plants and len(plants) > 0:
            first_plant_id = plants[0].get('plant_id')
            fetch_plant_with_details(first_plant_id)
        
        print("\n" + "=" * 50)
        print("All fetch operations completed successfully!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n✗ Error during fetch operations: {e}")

if __name__ == "__main__":
    main()