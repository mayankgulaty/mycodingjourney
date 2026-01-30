"""
Advanced Analytics for Dublin Bus Data
Generates insights, statistics, and prepares data for visualizations
"""
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from config import DATABASE_PATH
import json


class BusAnalytics:
    """Analytics engine for Dublin Bus data"""
    
    def __init__(self):
        self.conn = sqlite3.connect(DATABASE_PATH)
        
    def get_fleet_summary(self) -> dict:
        """Get overall fleet statistics"""
        positions = pd.read_sql("SELECT * FROM vehicle_positions", self.conn)
        updates = pd.read_sql("SELECT * FROM trip_updates", self.conn)
        
        return {
            "total_position_records": len(positions),
            "total_update_records": len(updates),
            "unique_vehicles": positions['vehicle_id'].nunique(),
            "unique_routes": positions['route_id'].nunique(),
            "data_start": str(positions['collected_at'].min()),
            "data_end": str(positions['collected_at'].max()),
            "snapshots": positions['collected_at'].nunique()
        }
    
    def get_delay_statistics(self) -> dict:
        """Analyze delay patterns"""
        updates = pd.read_sql("SELECT * FROM trip_updates", self.conn)
        
        if len(updates) == 0:
            return {}
        
        updates['arrival_delay_mins'] = updates['arrival_delay'] / 60
        updates['departure_delay_mins'] = updates['departure_delay'] / 60
        
        # Categorize delays
        def categorize_delay(mins):
            if mins < -1:
                return 'Early'
            elif mins <= 1:
                return 'On Time'
            elif mins <= 5:
                return 'Slight Delay'
            elif mins <= 15:
                return 'Moderate Delay'
            else:
                return 'Severe Delay'
        
        updates['delay_category'] = updates['arrival_delay_mins'].apply(categorize_delay)
        
        return {
            "avg_delay_mins": round(updates['arrival_delay_mins'].mean(), 2),
            "median_delay_mins": round(updates['arrival_delay_mins'].median(), 2),
            "max_delay_mins": round(updates['arrival_delay_mins'].max(), 2),
            "min_delay_mins": round(updates['arrival_delay_mins'].min(), 2),
            "std_delay_mins": round(updates['arrival_delay_mins'].std(), 2),
            "on_time_percentage": round((updates['delay_category'] == 'On Time').mean() * 100, 1),
            "early_percentage": round((updates['delay_category'] == 'Early').mean() * 100, 1),
            "delayed_percentage": round((updates['arrival_delay_mins'] > 1).mean() * 100, 1),
            "severe_delay_percentage": round((updates['arrival_delay_mins'] > 15).mean() * 100, 1),
            "delay_distribution": updates['delay_category'].value_counts().to_dict()
        }
    
    def get_route_performance(self, top_n: int = 20) -> pd.DataFrame:
        """Analyze performance by route"""
        updates = pd.read_sql("""
            SELECT route_id, arrival_delay, departure_delay 
            FROM trip_updates
            WHERE route_id IS NOT NULL
        """, self.conn)
        
        if len(updates) == 0:
            return pd.DataFrame()
        
        updates['arrival_delay_mins'] = updates['arrival_delay'] / 60
        
        route_stats = updates.groupby('route_id').agg({
            'arrival_delay_mins': ['mean', 'median', 'std', 'count']
        }).round(2)
        
        route_stats.columns = ['avg_delay', 'median_delay', 'std_delay', 'sample_count']
        route_stats = route_stats.reset_index()
        route_stats['on_time_rate'] = updates.groupby('route_id').apply(
            lambda x: (x['arrival_delay_mins'].abs() <= 1).mean() * 100
        ).values
        
        return route_stats.sort_values('sample_count', ascending=False).head(top_n)
    
    def get_geographic_data(self) -> pd.DataFrame:
        """Get geographic data for mapping"""
        positions = pd.read_sql("""
            SELECT vehicle_id, route_id, latitude, longitude, 
                   collected_at, direction_id
            FROM vehicle_positions
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        """, self.conn)
        
        return positions
    
    def get_latest_positions(self) -> pd.DataFrame:
        """Get most recent position for each vehicle"""
        return pd.read_sql("""
            SELECT * FROM vehicle_positions
            WHERE collected_at = (SELECT MAX(collected_at) FROM vehicle_positions)
        """, self.conn)
    
    def get_vehicle_trajectories(self, vehicle_id: str = None) -> pd.DataFrame:
        """Get movement history for vehicles"""
        query = """
            SELECT vehicle_id, route_id, latitude, longitude, 
                   collected_at, timestamp
            FROM vehicle_positions
            WHERE latitude IS NOT NULL
        """
        if vehicle_id:
            query += f" AND vehicle_id = '{vehicle_id}'"
        query += " ORDER BY vehicle_id, collected_at"
        
        return pd.read_sql(query, self.conn)
    
    def get_activity_by_time(self) -> pd.DataFrame:
        """Get fleet activity over time"""
        return pd.read_sql("""
            SELECT collected_at,
                   COUNT(DISTINCT vehicle_id) as active_vehicles,
                   COUNT(DISTINCT route_id) as active_routes
            FROM vehicle_positions
            GROUP BY collected_at
            ORDER BY collected_at
        """, self.conn)
    
    def get_operator_breakdown(self) -> dict:
        """Estimate operator breakdown based on route patterns"""
        positions = pd.read_sql("SELECT DISTINCT route_id FROM vehicle_positions", self.conn)
        
        # TFI route IDs have patterns:
        # 5240_xxx = Dublin Bus
        # 5249_xxx = Go-Ahead
        # Other patterns for Bus Éireann
        
        operators = {
            'Dublin Bus': 0,
            'Go-Ahead Ireland': 0,
            'Bus Éireann': 0,
            'Other': 0
        }
        
        for route in positions['route_id'].dropna():
            if route.startswith('5240'):
                operators['Dublin Bus'] += 1
            elif route.startswith('5249'):
                operators['Go-Ahead Ireland'] += 1
            elif route.startswith('52'):
                operators['Bus Éireann'] += 1
            else:
                operators['Other'] += 1
        
        return operators
    
    def export_summary_json(self, filepath: str = None):
        """Export all analytics as JSON"""
        summary = {
            "generated_at": datetime.now().isoformat(),
            "fleet_summary": self.get_fleet_summary(),
            "delay_statistics": self.get_delay_statistics(),
            "operator_breakdown": self.get_operator_breakdown(),
            "top_routes": self.get_route_performance(10).to_dict('records')
        }
        
        if filepath:
            with open(filepath, 'w') as f:
                json.dump(summary, f, indent=2, default=str)
        
        return summary
    
    def close(self):
        self.conn.close()


if __name__ == "__main__":
    analytics = BusAnalytics()
    
    print("\n" + "="*60)
    print("DUBLIN BUS ANALYTICS SUMMARY")
    print("="*60)
    
    # Fleet Summary
    fleet = analytics.get_fleet_summary()
    print("\n📊 FLEET OVERVIEW")
    print(f"   Total position records: {fleet['total_position_records']:,}")
    print(f"   Total delay records: {fleet['total_update_records']:,}")
    print(f"   Unique vehicles: {fleet['unique_vehicles']}")
    print(f"   Unique routes: {fleet['unique_routes']}")
    print(f"   Data snapshots: {fleet['snapshots']}")
    
    # Delay Stats
    delays = analytics.get_delay_statistics()
    if delays:
        print("\n⏱️  DELAY ANALYSIS")
        print(f"   Average delay: {delays['avg_delay_mins']:.1f} mins")
        print(f"   Median delay: {delays['median_delay_mins']:.1f} mins")
        print(f"   On-time rate: {delays['on_time_percentage']:.1f}%")
        print(f"   Severe delays (>15min): {delays['severe_delay_percentage']:.1f}%")
    
    # Operators
    operators = analytics.get_operator_breakdown()
    print("\n🚌 OPERATORS (by route count)")
    for op, count in sorted(operators.items(), key=lambda x: -x[1]):
        print(f"   {op}: {count} routes")
    
    # Export
    analytics.export_summary_json("../data/analytics_summary.json")
    print("\n✅ Summary exported to data/analytics_summary.json")
    
    analytics.close()
