// src/components/stats/MonthlyPerformanceChart.jsx
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const MonthlyPerformanceChart = ({ data }) => {
  const { isDark } = useTheme();
  
  // Format the tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-dark-card text-white' : 'bg-white text-gray-800'}`}>
          <p className="text-sm font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }} className="text-xs">
              {`${entry.name}: ${entry.value} ${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl p-5 ${
      isDark ? 'bg-dark-card' : 'bg-white shadow-sm'
    } transition-colors duration-200`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className={`text-lg font-semibold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Monthly Performance</h2>
          <p className={`text-sm ${
            isDark ? 'text-text-muted' : 'text-gray-500'
          }`}>Last 30 days consolidated metrics</p>
        </div>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a334a' : '#e5e7eb'} />
            <XAxis 
              dataKey="week" 
              stroke={isDark ? '#94a3b8' : '#6b7280'}
              tick={{ fill: isDark ? '#94a3b8' : '#6b7280' }}
            />
            <YAxis 
              stroke={isDark ? '#94a3b8' : '#6b7280'}
              tick={{ fill: isDark ? '#94a3b8' : '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="totalVolume" name="Total Volume" fill="#3b82f6" unit="kg" />
            <Bar dataKey="workoutCount" name="Workouts" fill="#10b981" />
            <Bar dataKey="averageIntensity" name="Avg Intensity" fill="#f59e0b" unit="%" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyPerformanceChart;