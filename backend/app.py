# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional
import os
import uvicorn

# Load environment variables from .env
load_dotenv()

# Import your existing Python logic
from scripts.manager_new_activity import NewActivity

app = FastAPI(title="Plant Dashboard API")

origins = [
    "http://127.0.0.1:5501",      # local dev
    "http://localhost:5501",       # in case browser uses localhost
    "https://rymatsumoto-bit.github.io/plant.dashboard.github.io"  # production frontend
]

# Optional: allow frontend calls from GitHub Pages (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# PYDANTIC MODELS
# ============================================
class PlantActivity(BaseModel):
    plant_id: str
    activity_type_code: str  # "watering", "fertilizing", etc.
    activity_date: str
    quantifier: Optional[float] = None
    unit: Optional[str] = None
    notes: Optional[str] = None
    result: Optional[str] = None
    user_id: str
    
# ============================================
# ENDPOINTS
# ============================================

# Health check endpoint
@app.get("/")
def root():
    return {"message": "Backend is running"}

# NEW: Plant activity endpoint (watering, fertilizing, etc.)
@app.post("/api/new-activity")
async def new_activity(activityData: PlantActivity):
    """
    Logs a new activity (watering, fertilizing, etc.) for a plant
    Triggers factor calculations, status updates, and schedule management
    """
    try:
        # Create NewActivity instance and run the orchestrator
        new_activity = NewActivity()
        stats = new_activity.run(activityData = activityData)
        
        return {
            "status": "success",
            "message": f"{activityData.activity_type_code.capitalize()} activity logged and processed successfully",
            "logged_at": datetime.now().isoformat(),
            "stats": stats,
            "data": activityData.dict()
        }
        
    except Exception as e:
        print(f"Error processing activity: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process activity: {str(e)}"
        )

if __name__ == "__main__":
    # Use Render's port, or default to 10000 for local testing
    port = int(os.environ.get("PORT", 10000))
    # 'app' must match your FastAPI variable name: app = FastAPI()
    uvicorn.run("app:app", host="0.0.0.0", port=port)