"""
Dublin Bus Real-Time Dashboard
An interactive Streamlit application for visualizing Dublin bus data
"""
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import sqlite3
from pathlib import Path
import json

# Page config
st.set_page_config(
    page_title="Dublin Bus Analytics",
    page_icon="🚌",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern look
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(90deg, #10b981, #3b82f6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0;
    }
    .metric-card {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border-radius: 16px;
        padding: 24px;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .stMetric {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border-radius: 12px;
        padding: 16px;
        border: 1px solid rgba(255,255,255,0.1);
    }
    div[data-testid="stMetricValue"] {
        font-size: 2rem;
        font-weight: 700;
    }
</style>
""", unsafe_allow_html=True)

# Database path
DB_PATH = Path(__file__).parent / "data" / "dublin_bus.db"


@st.cache_data(ttl=60)
def load_data():
    """Load data from SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    
    positions = pd.read_sql("SELECT * FROM vehicle_positions", conn)
    updates = pd.read_sql("SELECT * FROM trip_updates", conn)
    
    conn.close()
    
    positions['collected_at'] = pd.to_datetime(positions['collected_at'])
    updates['collected_at'] = pd.to_datetime(updates['collected_at'])
    updates['arrival_delay_mins'] = updates['arrival_delay'] / 60
    
    return positions, updates


def create_map(positions_df):
    """Create an interactive map with bus positions"""
    latest = positions_df.sort_values('collected_at').groupby('vehicle_id').last().reset_index()
    
    fig = px.scatter_mapbox(
        latest,
        lat='latitude',
        lon='longitude',
        color='route_id',
        hover_name='vehicle_id',
        hover_data=['route_id', 'direction_id'],
        zoom=10,
        height=600,
        title="Live Bus Positions"
    )
    
    fig.update_layout(
        mapbox_style="carto-darkmatter",
        mapbox=dict(
            center=dict(lat=53.35, lon=-6.26)
        ),
        margin=dict(l=0, r=0, t=40, b=0),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        showlegend=False
    )
    
    return fig


def create_heatmap(positions_df):
    """Create a density heatmap"""
    latest = positions_df.sort_values('collected_at').groupby('vehicle_id').last().reset_index()
    
    fig = px.density_mapbox(
        latest,
        lat='latitude',
        lon='longitude',
        radius=20,
        zoom=10,
        height=500,
        title="Bus Density Heatmap"
    )
    
    fig.update_layout(
        mapbox_style="carto-darkmatter",
        mapbox=dict(center=dict(lat=53.35, lon=-6.26)),
        margin=dict(l=0, r=0, t=40, b=0),
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white')
    )
    
    return fig


def create_delay_distribution(updates_df):
    """Create delay distribution chart"""
    fig = px.histogram(
        updates_df,
        x='arrival_delay_mins',
        nbins=50,
        title="Distribution of Arrival Delays",
        labels={'arrival_delay_mins': 'Delay (minutes)', 'count': 'Frequency'},
        color_discrete_sequence=['#10b981']
    )
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        xaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
        yaxis=dict(gridcolor='rgba(255,255,255,0.1)')
    )
    
    # Add vertical line at 0
    fig.add_vline(x=0, line_dash="dash", line_color="white", opacity=0.5)
    
    return fig


def create_delay_gauge(on_time_pct):
    """Create a gauge chart for on-time performance"""
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=on_time_pct,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': "On-Time Performance", 'font': {'size': 20, 'color': 'white'}},
        delta={'reference': 80, 'increasing': {'color': "#10b981"}, 'decreasing': {'color': "#ef4444"}},
        number={'suffix': '%', 'font': {'color': 'white'}},
        gauge={
            'axis': {'range': [0, 100], 'tickcolor': 'white'},
            'bar': {'color': "#10b981"},
            'bgcolor': "rgba(0,0,0,0)",
            'borderwidth': 2,
            'bordercolor': "rgba(255,255,255,0.2)",
            'steps': [
                {'range': [0, 50], 'color': 'rgba(239, 68, 68, 0.3)'},
                {'range': [50, 80], 'color': 'rgba(245, 158, 11, 0.3)'},
                {'range': [80, 100], 'color': 'rgba(16, 185, 129, 0.3)'}
            ],
            'threshold': {
                'line': {'color': "white", 'width': 4},
                'thickness': 0.75,
                'value': on_time_pct
            }
        }
    ))
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        height=300
    )
    
    return fig


def create_route_performance_chart(updates_df):
    """Create route performance bar chart"""
    route_stats = updates_df.groupby('route_id').agg({
        'arrival_delay_mins': ['mean', 'count']
    }).round(2)
    route_stats.columns = ['avg_delay', 'count']
    route_stats = route_stats.reset_index()
    route_stats = route_stats[route_stats['count'] >= 10].sort_values('avg_delay', ascending=True).head(20)
    
    colors = ['#10b981' if x < 0 else '#ef4444' if x > 5 else '#f59e0b' for x in route_stats['avg_delay']]
    
    fig = go.Figure(go.Bar(
        x=route_stats['avg_delay'],
        y=route_stats['route_id'],
        orientation='h',
        marker_color=colors,
        text=route_stats['avg_delay'].round(1),
        textposition='auto'
    ))
    
    fig.update_layout(
        title="Route Performance (Avg Delay in Minutes)",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        xaxis=dict(gridcolor='rgba(255,255,255,0.1)', title='Average Delay (mins)'),
        yaxis=dict(gridcolor='rgba(255,255,255,0.1)', title=''),
        height=500
    )
    
    fig.add_vline(x=0, line_dash="dash", line_color="white", opacity=0.5)
    
    return fig


def create_activity_timeline(positions_df):
    """Create activity over time chart"""
    activity = positions_df.groupby('collected_at')['vehicle_id'].nunique().reset_index()
    activity.columns = ['time', 'active_vehicles']
    
    fig = px.area(
        activity,
        x='time',
        y='active_vehicles',
        title="Fleet Activity Over Time",
        labels={'active_vehicles': 'Active Buses', 'time': 'Time'},
        color_discrete_sequence=['#3b82f6']
    )
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        xaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
        yaxis=dict(gridcolor='rgba(255,255,255,0.1)')
    )
    
    return fig


def create_delay_categories_pie(updates_df):
    """Create pie chart of delay categories"""
    def categorize(mins):
        if mins < -1:
            return 'Early (>1 min)'
        elif mins <= 1:
            return 'On Time (±1 min)'
        elif mins <= 5:
            return 'Slight (1-5 min)'
        elif mins <= 15:
            return 'Moderate (5-15 min)'
        else:
            return 'Severe (>15 min)'
    
    updates_df['category'] = updates_df['arrival_delay_mins'].apply(categorize)
    category_counts = updates_df['category'].value_counts()
    
    colors = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444']
    
    fig = px.pie(
        values=category_counts.values,
        names=category_counts.index,
        title="Delay Categories",
        color_discrete_sequence=colors,
        hole=0.4
    )
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white')
    )
    
    return fig


# Main App
def main():
    # Header
    st.markdown('<h1 class="main-header">🚌 Dublin Bus Analytics</h1>', unsafe_allow_html=True)
    st.markdown("*Real-time insights from Transport for Ireland's GTFS-Realtime API*")
    st.markdown("---")
    
    # Load data
    try:
        positions, updates = load_data()
    except Exception as e:
        st.error(f"Error loading data: {e}")
        st.info("Run the data collector first: `python src/data_collector.py --once`")
        return
    
    # Sidebar
    with st.sidebar:
        st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Dublin_Bus_logo.svg/200px-Dublin_Bus_logo.svg.png", width=150)
        st.markdown("### Data Summary")
        st.metric("Position Records", f"{len(positions):,}")
        st.metric("Delay Records", f"{len(updates):,}")
        st.metric("Unique Vehicles", positions['vehicle_id'].nunique())
        st.metric("Unique Routes", positions['route_id'].nunique())
        
        st.markdown("---")
        st.markdown("### About")
        st.markdown("""
        This dashboard visualizes real-time bus data 
        from Dublin Bus, Bus Éireann, and Go-Ahead Ireland.
        
        **Data Source:** Transport for Ireland GTFS-RT API
        
        **Built by:** [Mayank Gulaty](https://mycodingjourney.com)
        """)
    
    # Key Metrics Row
    col1, col2, col3, col4 = st.columns(4)
    
    on_time_pct = (updates['arrival_delay_mins'].abs() <= 1).mean() * 100
    avg_delay = updates['arrival_delay_mins'].mean()
    severe_pct = (updates['arrival_delay_mins'] > 15).mean() * 100
    
    with col1:
        st.metric("🚌 Active Buses", positions['vehicle_id'].nunique())
    with col2:
        st.metric("✅ On-Time Rate", f"{on_time_pct:.1f}%")
    with col3:
        st.metric("⏱️ Avg Delay", f"{avg_delay:.1f} min")
    with col4:
        st.metric("⚠️ Severe Delays", f"{severe_pct:.1f}%")
    
    st.markdown("---")
    
    # Tabs for different views
    tab1, tab2, tab3, tab4 = st.tabs(["🗺️ Live Map", "📊 Delay Analysis", "🛣️ Route Performance", "📈 Trends"])
    
    with tab1:
        col1, col2 = st.columns([2, 1])
        with col1:
            st.plotly_chart(create_map(positions), use_container_width=True)
        with col2:
            st.plotly_chart(create_heatmap(positions), use_container_width=True)
    
    with tab2:
        col1, col2 = st.columns([1, 1])
        with col1:
            st.plotly_chart(create_delay_distribution(updates), use_container_width=True)
        with col2:
            st.plotly_chart(create_delay_gauge(on_time_pct), use_container_width=True)
        
        st.plotly_chart(create_delay_categories_pie(updates), use_container_width=True)
    
    with tab3:
        st.plotly_chart(create_route_performance_chart(updates), use_container_width=True)
        
        # Top performing routes
        st.markdown("### 🏆 Best Performing Routes")
        route_stats = updates.groupby('route_id').agg({
            'arrival_delay_mins': 'mean'
        }).round(2).reset_index()
        route_stats.columns = ['Route ID', 'Avg Delay (mins)']
        route_stats = route_stats.sort_values('Avg Delay (mins)').head(10)
        st.dataframe(route_stats, use_container_width=True)
    
    with tab4:
        st.plotly_chart(create_activity_timeline(positions), use_container_width=True)
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #6b7280;'>
        <p>Data refreshes every 60 seconds • Built with Streamlit & Plotly</p>
        <p>© 2026 Mayank Gulaty | <a href="https://mycodingjourney.com">Portfolio</a> | <a href="https://github.com/mayankgulaty">GitHub</a></p>
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
