# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn

# Load environment variables from .env
load_dotenv()

# Import your existing Python logic
from scripts.manager_daily import DailyBatch

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

# Health check endpoint
@app.get("/")
def root():
    return {"message": "Backend is running"}

# Example endpoint to run your status calculation
@app.get("/status")
def get_status():
#    """
#    Calls your Python script to calculate plant status
#    Returns a JSON response
#    """
    try:
        batch_run = DailyBatch()  # your function in scripts/status_calculation.py
        stats = batch_run.run()
        return {"status": "success", "stats": stats}
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    # Use Render's port, or default to 10000 for local testing
    port = int(os.environ.get("PORT", 10000))
    # 'app' must match your FastAPI variable name: app = FastAPI()
    uvicorn.run("app:app", host="0.0.0.0", port=port)