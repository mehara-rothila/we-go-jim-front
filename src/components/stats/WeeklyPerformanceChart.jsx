// src/components/stats/WeeklyPerformanceChart.jsx
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const WeeklyPerformanceChart = ({ data }) => {
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
          }`}>Weekly Performance</h2>
          <p className={`text-sm ${
            isDark ? 'text-text-muted' : 'text-gray-500'
          }`}>Last 7 days workout metrics</p>
        </div>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a334a' : '#e5e7eb'} />
            <XAxis 
              dataKey="day" 
              stroke={isDark ? '#94a3b8' : '#6b7280'}
              tick={{ fill: isDark ? '#94a3b8' : '#6b7280' }}
            />
            <YAxis 
              yAxisId="left"
              stroke={isDark ? '#94a3b8' : '#6b7280'}
              tick={{ fill: isDark ? '#94a3b8' : '#6b7280' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke={isDark ? '#94a3b8' : '#6b7280'}
              tick={{ fill: isDark ? '#94a3b8' : '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="totalVolume" 
              name="Total Volume" 
              stroke="#3b82f6" 
              activeDot={{ r: 8 }}
              unit="kg"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="avgWeight" 
              name="Avg Weight" 
              stroke="#60a5fa" 
              unit="kg"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="totalSets" 
              name="Total Sets" 
              stroke="#10b981" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyPerformanceChart;