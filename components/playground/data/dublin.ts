// Real numbers from the Dublin bus real-time pipeline (projects/dublin-bus-pipeline/data/analytics_summary.json).
// Snapshot: 9 polls of the GTFS-R feed over ~10 minutes on 30 Jan 2026. Small sample, so treat it as a demo dataset.
export type Row = Record<string, string | number | null>

export const FLEET = {
  "total_position_records": 6121,
  "total_update_records": 73208,
  "unique_vehicles": 708,
  "unique_routes": 198,
  "data_start": "2026-01-30 22:44:10.601121",
  "data_end": "2026-01-30 22:53:51.522046",
  "snapshots": 9
}

export const ROUTES: Row[] = [
  {
    "route_id": "5332_120618",
    "avg_delay": 1.22,
    "median_delay": 0.0,
    "std_delay": 3.67,
    "sample_count": 2097,
    "on_time_rate": 86.0
  },
  {
    "route_id": "5332_120560",
    "avg_delay": 0.63,
    "median_delay": 0.0,
    "std_delay": 2.7,
    "sample_count": 2002,
    "on_time_rate": 89.1
  },
  {
    "route_id": "5332_120656",
    "avg_delay": 1.62,
    "median_delay": 0.0,
    "std_delay": 5.52,
    "sample_count": 1895,
    "on_time_rate": 87.7
  },
  {
    "route_id": "5332_120559",
    "avg_delay": 1.38,
    "median_delay": 0.0,
    "std_delay": 4.08,
    "sample_count": 1657,
    "on_time_rate": 85.3
  },
  {
    "route_id": "5332_120558",
    "avg_delay": 1.5,
    "median_delay": 0.0,
    "std_delay": 3.93,
    "sample_count": 1498,
    "on_time_rate": 81.4
  },
  {
    "route_id": "5242_119680",
    "avg_delay": 1.1,
    "median_delay": -0.25,
    "std_delay": 3.95,
    "sample_count": 1386,
    "on_time_rate": 38.5
  },
  {
    "route_id": "5332_120575",
    "avg_delay": 0.3,
    "median_delay": 0.0,
    "std_delay": 1.55,
    "sample_count": 1348,
    "on_time_rate": 95.4
  },
  {
    "route_id": "5332_120620",
    "avg_delay": 1.5,
    "median_delay": 0.0,
    "std_delay": 3.31,
    "sample_count": 1290,
    "on_time_rate": 78.2
  },
  {
    "route_id": "5242_118188",
    "avg_delay": 2.79,
    "median_delay": 2.52,
    "std_delay": 2.82,
    "sample_count": 1221,
    "on_time_rate": 23.3
  },
  {
    "route_id": "5332_120628",
    "avg_delay": 0.64,
    "median_delay": 0.0,
    "std_delay": 1.95,
    "sample_count": 1213,
    "on_time_rate": 83.4
  }
]

export const DELAY_DISTRIBUTION: Row[] = [
  {
    "category": "On Time",
    "records": 52143
  },
  {
    "category": "Slight Delay",
    "records": 10413
  },
  {
    "category": "Moderate Delay",
    "records": 6561
  },
  {
    "category": "Early",
    "records": 2611
  },
  {
    "category": "Severe Delay",
    "records": 1480
  }
]

export const OPERATORS: Row[] = [
  {
    "operator": "Dublin Bus",
    "routes": 3
  },
  {
    "operator": "Go-Ahead Ireland",
    "routes": 27
  },
  {
    "operator": "Bus \u00c9ireann",
    "routes": 0
  },
  {
    "operator": "Other",
    "routes": 168
  }
]

export const DELAY_STATS = {
  "avg_delay_mins": 1.61,
  "median_delay_mins": 0.0,
  "max_delay_mins": 155.85,
  "min_delay_mins": -69.18,
  "std_delay_mins": 6.58,
  "on_time_percentage": 71.2,
  "early_percentage": 3.6,
  "delayed_percentage": 25.2,
  "severe_delay_percentage": 2.0
}
