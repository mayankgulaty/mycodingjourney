"""Configuration for Dublin Bus Pipeline"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Configuration
TFI_API_KEY = os.getenv("TFI_API_KEY")
TFI_BASE_URL = os.getenv("TFI_BASE_URL", "https://api.nationaltransport.ie/gtfsr/v2")

# Endpoints
VEHICLES_ENDPOINT = f"{TFI_BASE_URL}/Vehicles"
TRIP_UPDATES_ENDPOINT = f"{TFI_BASE_URL}/TripUpdates"

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Create directories
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)

# Database
DATABASE_PATH = DATA_DIR / "dublin_bus.db"
