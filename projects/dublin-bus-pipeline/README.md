# Dublin Bus Real-Time Data Pipeline

A complete data engineering project that collects, processes, and visualizes real-time bus data from Transport for Ireland's GTFS-Realtime API.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🎯 Key Metrics

| Metric | Value |
|--------|-------|
| Vehicles Tracked | 708+ |
| Routes Covered | 198 |
| On-Time Rate | 71.2% |
| Data Points | 100K+ |

## Overview

This project demonstrates a complete data pipeline for processing real-time transit data:

- **Data Ingestion**: Fetches live bus positions and delays every 30 seconds
- **Storage**: SQLite database with indexed columns for fast queries
- **Analytics**: Python analytics engine with comprehensive statistics
- **Dashboard**: Interactive Streamlit dashboard with live visualizations
- **Integration**: Embedded React component for portfolio website

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   TFI API       │────▶│  Data Collector │────▶│   SQLite DB     │
│  (GTFS-RT)      │     │   (Python)      │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │  Jupyter        │
                                               │  Analysis       │
                                               └────────┬────────┘
                                                        │
                                    ┌───────────────────┼───────────────────┐
                                    ▼                   ▼                   ▼
                              ┌──────────┐       ┌──────────┐       ┌──────────┐
                              │ Live Map │       │  Delay   │       │  Route   │
                              │ (Folium) │       │ Analysis │       │  Stats   │
                              └──────────┘       └──────────┘       └──────────┘
```

## Data Sources

- **Vehicle Positions**: Real-time GPS coordinates of all buses
- **Trip Updates**: Arrival/departure delays at stops
- **Operators**: Dublin Bus, Bus Éireann, Go-Ahead Ireland, LUAS

## Quick Start

### 1. Install Dependencies

```bash
cd projects/dublin-bus-pipeline
pip install -r requirements.txt
```

### 2. Configure API Key

The `.env` file should contain your TFI API key:

```env
TFI_API_KEY=your_api_key_here
```

Get a free key at: https://developer.nationaltransport.ie/

### 3. Collect Data

```bash
# Single collection
python src/data_collector.py --once

# Continuous collection (30 mins, every 60 seconds)
python src/data_collector.py --duration 30 --interval 60
```

### 4. Analyze Data

```bash
jupyter notebook notebooks/analysis.ipynb
```

## Project Structure

```
dublin-bus-pipeline/
├── data/
│   ├── raw/              # Raw JSON snapshots
│   ├── processed/        # Processed data
│   └── dublin_bus.db     # SQLite database
├── notebooks/
│   └── analysis.ipynb    # Analysis notebook
├── src/
│   ├── config.py         # Configuration
│   └── data_collector.py # Data collection script
├── requirements.txt
├── .env
└── README.md
```

## Sample Outputs

### Live Bus Map
Interactive map showing real-time positions of all buses in Dublin.

### Delay Analysis
- Average delay: X minutes
- On-time performance: X%
- Worst performing routes

### Fleet Statistics
- Active vehicles over time
- Route activity rankings
- Geographic coverage heatmap

## Technical Highlights

- **Efficient Storage**: SQLite with indexed columns for fast queries
- **Incremental Collection**: Continuous polling with configurable intervals
- **Interactive Visualizations**: Folium maps + Plotly charts
- **Modular Design**: Easy to extend with new data sources

## Future Enhancements

- [ ] Add weather data correlation
- [ ] Implement delay prediction model
- [ ] Deploy to AWS with scheduled Lambda
- [ ] Create real-time dashboard with Streamlit

## License

MIT License - Feel free to use this for your own projects!

## Author

**Mayank Gulaty**  
Data Engineer | [Portfolio](https://mycodingjourney.com) | [LinkedIn](https://linkedin.com/in/mayankgulaty)
