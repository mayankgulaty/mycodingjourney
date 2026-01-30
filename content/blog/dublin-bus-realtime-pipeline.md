# Building a Real-Time Transit Data Pipeline: Dublin Bus Analytics

How I built a complete data pipeline that tracks 680+ buses in real-time across Dublin, from API ingestion to interactive dashboards—all in a single day.

---

## The Opportunity: Open Transit Data

Transport for Ireland provides one of Europe's best public transit data APIs. Their GTFS-Realtime (GTFS-RT) feed offers:

- **Vehicle Positions**: Real-time GPS coordinates for every bus
- **Trip Updates**: Arrival and departure delays at each stop
- **Service Alerts**: Disruptions and schedule changes

This data covers **Dublin Bus**, **Bus Éireann**, **Go-Ahead Ireland**, and even **LUAS** (Dublin's tram system). As a data engineer living in Dublin, I saw an opportunity to build something useful while demonstrating my skills.

## What I Built

A complete data engineering project that:

1. **Ingests** real-time bus data every 30 seconds
2. **Stores** positions and delays in a SQLite database
3. **Analyzes** patterns with Python (Pandas)
4. **Visualizes** results in an interactive Streamlit dashboard

Let me walk you through each component.

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   TFI API       │────▶│  Data Collector │────▶│   SQLite DB     │
│  (GTFS-RT)      │     │   (Python)      │     │                 │
│                 │     │                 │     │  • positions    │
│ • /Vehicles     │     │  • Polling      │     │  • trip_updates │
│ • /TripUpdates  │     │  • Parsing      │     │  • indexes      │
└─────────────────┘     │  • Validation   │     └────────┬────────┘
                        └─────────────────┘              │
                                                         ▼
                                               ┌─────────────────┐
                                               │   Analytics     │
                                               │   Engine        │
                                               └────────┬────────┘
                                                        │
                              ┌──────────────────┬──────┴──────────────────┐
                              ▼                  ▼                         ▼
                        ┌──────────┐      ┌──────────┐              ┌──────────┐
                        │ Streamlit│      │ Jupyter  │              │   JSON   │
                        │Dashboard │      │ Notebook │              │  Export  │
                        └──────────┘      └──────────┘              └──────────┘
```

---

## Step 1: Understanding GTFS-Realtime

GTFS-RT is an extension of the General Transit Feed Specification (GTFS) designed for real-time transit data. The API returns Protocol Buffer (protobuf) format by default, but TFI also supports JSON.

Here's what a vehicle position looks like:

```json
{
  "id": "V123",
  "vehicle": {
    "trip": {
      "trip_id": "5240_626",
      "route_id": "5240_119666",
      "start_time": "22:05:00",
      "start_date": "20260130",
      "direction_id": 0
    },
    "position": {
      "latitude": 53.3538666,
      "longitude": -7.09222
    },
    "timestamp": "1769812820",
    "vehicle": {
      "id": "25"
    }
  }
}
```

The route IDs follow a pattern: `5240_*` is Dublin Bus, `5249_*` is Go-Ahead Ireland. This lets us segment analysis by operator.

---

## Step 2: Building the Data Collector

The collector is a Python script that polls the API and stores results. Key design decisions:

### Idempotent Database Initialization

```python
def _init_database(self):
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
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
    
    # Indexes for common queries
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_positions_time ON vehicle_positions(collected_at)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_positions_route ON vehicle_positions(route_id)")
    
    conn.commit()
```

### Error-Resilient Fetching

```python
def fetch_vehicle_positions(self) -> dict:
    """Fetch current vehicle positions"""
    try:
        response = requests.get(
            f"{VEHICLES_ENDPOINT}?format=json",
            headers={"x-api-key": API_KEY},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching vehicle positions: {e}")
        return {}  # Return empty dict, don't crash
```

### Configurable Collection Cycles

```python
def run_continuous_collection(interval_seconds=60, duration_minutes=30):
    """Run continuous data collection"""
    collector = DataCollector()
    end_time = datetime.now().timestamp() + (duration_minutes * 60)
    
    while datetime.now().timestamp() < end_time:
        try:
            collector.collect()
            time.sleep(interval_seconds)
        except KeyboardInterrupt:
            break
```

Running `python data_collector.py --duration 30 --interval 60` collects data every minute for 30 minutes.

---

## Step 3: What the Data Reveals

After just 5 minutes of collection, I had:

- **2,732** vehicle position records
- **42,042** trip update records
- **693** unique vehicles tracked
- **194** unique routes

### On-Time Performance

Analyzing the delay data reveals interesting patterns:

| Metric | Value |
|--------|-------|
| Average Delay | 2.3 minutes |
| On-Time (±1 min) | 45.2% |
| Slight Delay (1-5 min) | 28.7% |
| Moderate (5-15 min) | 18.4% |
| Severe (over 15 min) | 7.7% |

Nearly half of all buses are on-time, but over 7% have severe delays of 15+ minutes.

### Geographic Patterns

The heatmap visualization clearly shows:

- **Highest density**: Dublin City Centre (O'Connell Street area)
- **Major corridors**: Towards Dublin Airport, Dun Laoghaire, Tallaght
- **Lower coverage**: Western suburbs and industrial areas

---

## Step 4: Building the Dashboard

I used Streamlit for the interactive dashboard. Key features:

### Real-Time Map with Plotly

```python
def create_map(positions_df):
    latest = positions_df.groupby('vehicle_id').last().reset_index()
    
    fig = px.scatter_mapbox(
        latest,
        lat='latitude',
        lon='longitude',
        color='route_id',
        hover_name='vehicle_id',
        zoom=10,
        height=600
    )
    
    fig.update_layout(
        mapbox_style="carto-darkmatter",  # Dark theme
        mapbox=dict(center=dict(lat=53.35, lon=-6.26))
    )
    
    return fig
```

### Performance Gauge

```python
def create_delay_gauge(on_time_pct):
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=on_time_pct,
        title={'text': "On-Time Performance"},
        gauge={
            'axis': {'range': [0, 100]},
            'bar': {'color': "#10b981"},
            'steps': [
                {'range': [0, 50], 'color': 'rgba(239, 68, 68, 0.3)'},
                {'range': [50, 80], 'color': 'rgba(245, 158, 11, 0.3)'},
                {'range': [80, 100], 'color': 'rgba(16, 185, 129, 0.3)'}
            ]
        }
    ))
    return fig
```

---

## Lessons Learned

### 1. GTFS-RT is Well-Designed

The spec is thorough and consistent across transit agencies worldwide. Skills learned here transfer to any city's transit data.

### 2. SQLite is Underrated

For this scale (millions of records), SQLite performs excellently:
- No server to manage
- Single file to backup
- Indexes make queries fast
- Perfect for development and small-scale production

### 3. Timestamps Need Care

GTFS-RT uses Unix timestamps (seconds since 1970). Always convert to datetime for analysis:

```python
df['datetime'] = pd.to_datetime(df['timestamp'], unit='s')
```

### 4. Rate Limiting Matters

TFI's API is generous, but I still implemented:
- 30-second minimum between requests
- Exponential backoff on errors
- Request timeouts

---

## What's Next

This project could be extended in several ways:

1. **Predictive Modeling**: Train an ML model to predict delays based on time, route, and weather
2. **Historical Analysis**: Collect data over weeks to identify patterns
3. **Real-Time Alerts**: Notify when specific routes are delayed
4. **Cloud Deployment**: Move to AWS Lambda + S3 for scalability

---

## Try It Yourself

The complete source code is available on GitHub:

```bash
git clone https://github.com/mayankgulaty/mycodingjourney
cd projects/dublin-bus-pipeline

# Install dependencies
pip install -r requirements.txt

# Get your API key from https://developer.nationaltransport.ie
echo "TFI_API_KEY=your_key_here" > .env

# Collect data
python src/data_collector.py --once

# Run the dashboard
streamlit run app.py
```

---

## Conclusion

Building this pipeline took about 3 hours from start to working dashboard. The key was:

1. **Start with the data**: Understand what's available before writing code
2. **Keep it simple**: SQLite + Python + Streamlit is powerful enough
3. **Iterate quickly**: Get something working, then improve

Public transit data is a goldmine for data engineering projects. It's real, it's messy, and it tells interesting stories about how cities move.

---

*Questions about this project? Reach out on [LinkedIn](https://linkedin.com/in/mayankgulaty) or [GitHub](https://github.com/mayankgulaty).*
