'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bus, Clock, MapPin, TrendingUp, Activity, AlertTriangle } from 'lucide-react'

interface BusData {
  fleet_summary: {
    total_position_records: number
    total_update_records: number
    unique_vehicles: number
    unique_routes: number
    snapshots: number
  }
  delay_statistics: {
    avg_delay_mins: number
    median_delay_mins: number
    on_time_percentage: number
    delayed_percentage: number
    severe_delay_percentage: number
    delay_distribution: Record<string, number>
  }
  operator_breakdown: Record<string, number>
}

// Sample data - in production this would come from an API
const sampleData: BusData = {
  fleet_summary: {
    total_position_records: 6121,
    total_update_records: 73208,
    unique_vehicles: 708,
    unique_routes: 198,
    snapshots: 9
  },
  delay_statistics: {
    avg_delay_mins: 1.6,
    median_delay_mins: 0,
    on_time_percentage: 71.2,
    delayed_percentage: 28.8,
    severe_delay_percentage: 2.0,
    delay_distribution: {
      'On Time': 52000,
      'Slight Delay': 12000,
      'Moderate Delay': 6000,
      'Severe Delay': 1500,
      'Early': 1700
    }
  },
  operator_breakdown: {
    'Dublin Bus': 3,
    'Go-Ahead Ireland': 27,
    'Other': 168
  }
}

function MetricCard({ icon, value, label, trend }: { 
  icon: React.ReactNode
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' :
            trend === 'down' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  )
}

function DelayBar({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  )
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-green-400">Live Data</span>
    </div>
  )
}

export function DublinBusDashboard() {
  const [data] = useState<BusData>(sampleData)
  const [activeTab, setActiveTab] = useState<'overview' | 'delays' | 'routes'>('overview')

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Bus className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Dublin Bus Analytics</h3>
            <p className="text-sm text-gray-400">Real-time transit insights</p>
          </div>
        </div>
        <LiveIndicator />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'delays', 'routes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <MetricCard
            icon={<Bus className="w-5 h-5" />}
            value={data.fleet_summary.unique_vehicles}
            label="Active Vehicles"
            trend="up"
          />
          <MetricCard
            icon={<MapPin className="w-5 h-5" />}
            value={data.fleet_summary.unique_routes}
            label="Routes Covered"
          />
          <MetricCard
            icon={<Clock className="w-5 h-5" />}
            value={`${data.delay_statistics.on_time_percentage}%`}
            label="On-Time Rate"
            trend="up"
          />
          <MetricCard
            icon={<Activity className="w-5 h-5" />}
            value={`${(data.fleet_summary.total_update_records / 1000).toFixed(0)}K`}
            label="Data Points"
          />
        </motion.div>
      )}

      {activeTab === 'delays' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{data.delay_statistics.avg_delay_mins}</div>
              <div className="text-sm text-gray-400">Avg Delay (min)</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{data.delay_statistics.on_time_percentage}%</div>
              <div className="text-sm text-gray-400">On-Time</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{data.delay_statistics.severe_delay_percentage}%</div>
              <div className="text-sm text-gray-400">Severe Delays</div>
            </div>
          </div>

          {/* Delay Distribution */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-4">Delay Distribution</h4>
            <DelayBar label="On Time (±1 min)" percentage={71.2} color="bg-green-500" />
            <DelayBar label="Slight Delay (1-5 min)" percentage={16.4} color="bg-yellow-500" />
            <DelayBar label="Moderate (5-15 min)" percentage={8.2} color="bg-orange-500" />
            <DelayBar label="Severe (>15 min)" percentage={2.0} color="bg-red-500" />
            <DelayBar label="Early" percentage={2.2} color="bg-blue-500" />
          </div>
        </motion.div>
      )}

      {activeTab === 'routes' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-4">Operators by Route Count</h4>
            {Object.entries(data.operator_breakdown).sort((a, b) => b[1] - a[1]).map(([operator, count]) => (
              <div key={operator} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                <span className="text-gray-300">{operator}</span>
                <span className="text-white font-medium">{count} routes</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
              <div className="text-2xl font-bold text-white mb-1">{data.fleet_summary.unique_routes}</div>
              <div className="text-sm text-gray-400">Total Routes</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
              <div className="text-2xl font-bold text-white mb-1">{data.fleet_summary.snapshots}</div>
              <div className="text-sm text-gray-400">Data Snapshots</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-500">Data source: Transport for Ireland GTFS-RT API</span>
        <a 
          href="/projects/case-studies/dublin-bus-pipeline"
          className="text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          View Full Case Study →
        </a>
      </div>
    </div>
  )
}
