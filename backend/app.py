# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Import your existing Python logic
#from scripts.status_calculation import calculate_status

app = FastAPI(title="Plant Dashboard API")

# Optional: allow frontend calls from GitHub Pages (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
def root():
    return {"message": "Backend is running"}

# Example endpoint to run your status calculation
#@app.get("/status")
#def get_status():
#    """
#    Calls your Python script to calculate plant status
#    Returns a JSON response
#    """
#    result = calculate_status()  # your function in scripts/status_calculation.py
#    return result
