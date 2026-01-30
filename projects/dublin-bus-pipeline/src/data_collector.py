"""
Dublin Bus Real-Time Data Collector
Fetches vehicle positions and trip updates from Transport for Ireland API
"""
import json
import sqlite3
import requests
from datetime import datetime
from pathlib import Path
import pandas as pd
from config import (
    TFI_API_KEY, 
    VEHICLES_ENDPOINT, 
    TRIP_UPDATES_ENDPOINT,
    DATABASE_PATH,
    RAW_DATA_DIR
)


class DataCollector:
    """Collects real-time bus data from TFI API"""
    
    def __init__(self):
        self.headers = {"x-api-key": TFI_API_KEY}
        self._init_database()
    
    def _init_database(self):
        """Initialize SQLite database with required tables"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Vehicle positions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS vehicle_positions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                vehicle_id TEXT,
                trip_id TEXT,
                route_id TEXT,
                latitude REAL,
                longitude REAL,
                timestamp INTEGER,
                start_time TEXT,
                start_date TEXT,
                direction_id INTEGER
            )
        """)
        
        # Trip updates table (delays)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trip_updates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                trip_id TEXT,
                route_id TEXT,
                stop_id TEXT,
                arrival_delay INTEGER,
                departure_delay INTEGER,
                timestamp INTEGER
            )
        """)
        
        # Create indexes for faster queries
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_positions_time ON vehicle_positions(collected_at)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_positions_route ON vehicle_positions(route_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_updates_trip ON trip_updates(trip_id)")
        
        conn.commit()
        conn.close()
        print(f"Database initialized at {DATABASE_PATH}")
    
    def fetch_vehicle_positions(self) -> dict:
        """Fetch current vehicle positions"""
        try:
            response = requests.get(
                f"{VEHICLES_ENDPOINT}?format=json",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching vehicle positions: {e}")
            return {}
    
    def fetch_trip_updates(self) -> dict:
        """Fetch trip updates (delays)"""
        try:
            response = requests.get(
                f"{TRIP_UPDATES_ENDPOINT}?format=json",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching trip updates: {e}")
            return {}
    
    def parse_vehicle_positions(self, data: dict) -> list:
        """Parse vehicle positions from API response"""
        records = []
        entities = data.get("entity", [])
        
        for entity in entities:
            vehicle = entity.get("vehicle", {})
            trip = vehicle.get("trip", {})
            position = vehicle.get("position", {})
            
            records.append({
                "vehicle_id": vehicle.get("vehicle", {}).get("id"),
                "trip_id": trip.get("trip_id"),
                "route_id": trip.get("route_id"),
                "latitude": position.get("latitude"),
                "longitude": position.get("longitude"),
                "timestamp": vehicle.get("timestamp"),
                "start_time": trip.get("start_time"),
                "start_date": trip.get("start_date"),
                "direction_id": trip.get("direction_id")
            })
        
        return records
    
    def parse_trip_updates(self, data: dict) -> list:
        """Parse trip updates (delays) from API response"""
        records = []
        entities = data.get("entity", [])
        
        for entity in entities:
            trip_update = entity.get("trip_update", {})
            trip = trip_update.get("trip", {})
            
            for stop_update in trip_update.get("stop_time_update", []):
                arrival = stop_update.get("arrival", {})
                departure = stop_update.get("departure", {})
                
                records.append({
                    "trip_id": trip.get("trip_id"),
                    "route_id": trip.get("route_id"),
                    "stop_id": stop_update.get("stop_id"),
                    "arrival_delay": arrival.get("delay", 0),
                    "departure_delay": departure.get("delay", 0),
                    "timestamp": trip_update.get("timestamp")
                })
        
        return records
    
    def save_to_database(self, positions: list, updates: list):
        """Save collected data to SQLite database"""
        conn = sqlite3.connect(DATABASE_PATH)
        
        if positions:
            df_positions = pd.DataFrame(positions)
            df_positions["collected_at"] = datetime.now()
            df_positions.to_sql("vehicle_positions", conn, if_exists="append", index=False)
            print(f"Saved {len(positions)} vehicle positions")
        
        if updates:
            df_updates = pd.DataFrame(updates)
            df_updates["collected_at"] = datetime.now()
            df_updates.to_sql("trip_updates", conn, if_exists="append", index=False)
            print(f"Saved {len(updates)} trip updates")
        
        conn.close()
    
    def save_raw_snapshot(self, data: dict, prefix: str):
        """Save raw API response as JSON for debugging"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = RAW_DATA_DIR / f"{prefix}_{timestamp}.json"
        
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)
        
        return filepath
    
    def collect(self, save_raw: bool = False):
        """Run a single collection cycle"""
        print(f"\n{'='*50}")
        print(f"Collection started at {datetime.now()}")
        
        # Fetch data
        positions_data = self.fetch_vehicle_positions()
        updates_data = self.fetch_trip_updates()
        
        # Save raw if requested
        if save_raw and positions_data:
            self.save_raw_snapshot(positions_data, "vehicles")
        if save_raw and updates_data:
            self.save_raw_snapshot(updates_data, "updates")
        
        # Parse data
        positions = self.parse_vehicle_positions(positions_data)
        updates = self.parse_trip_updates(updates_data)
        
        # Save to database
        self.save_to_database(positions, updates)
        
        print(f"Collection completed at {datetime.now()}")
        return len(positions), len(updates)


def run_continuous_collection(interval_seconds: int = 60, duration_minutes: int = 30):
    """Run continuous data collection for specified duration"""
    import time
    
    collector = DataCollector()
    end_time = datetime.now().timestamp() + (duration_minutes * 60)
    collection_count = 0
    
    print(f"Starting continuous collection for {duration_minutes} minutes")
    print(f"Collecting every {interval_seconds} seconds")
    
    while datetime.now().timestamp() < end_time:
        try:
            positions, updates = collector.collect(save_raw=(collection_count == 0))
            collection_count += 1
            print(f"Total collections: {collection_count}")
            time.sleep(interval_seconds)
        except KeyboardInterrupt:
            print("\nCollection stopped by user")
            break
        except Exception as e:
            print(f"Error during collection: {e}")
            time.sleep(interval_seconds)
    
    print(f"\nCollection finished. Total cycles: {collection_count}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Dublin Bus Data Collector")
    parser.add_argument("--once", action="store_true", help="Run single collection")
    parser.add_argument("--duration", type=int, default=30, help="Duration in minutes")
    parser.add_argument("--interval", type=int, default=60, help="Interval in seconds")
    
    args = parser.parse_args()
    
    if args.once:
        collector = DataCollector()
        collector.collect(save_raw=True)
    else:
        run_continuous_collection(
            interval_seconds=args.interval,
            duration_minutes=args.duration
        )
