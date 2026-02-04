# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Import your existing Python logic
from scripts.manager_daily import DailyBatch

app = FastAPI(title="Plant Dashboard API")

# Optional: allow frontend calls from GitHub Pages (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://plant-dashboard-github-io.onrender.com"],  # replace "*" with your frontend URL in production
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
    batch_run = DailyBatch  # your function in scripts/status_calculation.py
    batch_run.run