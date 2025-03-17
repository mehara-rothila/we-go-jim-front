// src/components/stats/MetricCard.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const MetricCard = ({ title, value, change, icon: Icon, tooltip }) => {
  const { isDark } = useTheme();

  // Determine the color for change values
  const getChangeColor = (changeValue) => {
    if (!changeValue) return '';
    return changeValue.startsWith('+') ? 'text-emerald-500' : 'text-red-500';
  };
  
  return (
    <div className={`rounded-xl p-5 ${
      isDark ? 'bg-dark-card' : 'bg-white shadow-sm'
    } transition-colors duration-200`}>
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <span className={`text-sm font-medium ${
            isDark ? 'text-text-muted' : 'text-gray-500'
          }`}>{title}</span>
          <div className={`ml-auto p-2 rounded-lg ${
            isDark ? 'bg-dark-darker' : 'bg-gray-50'
          }`}>
            <Icon className={`w-4 h-4 ${
              isDark ? 'text-text-muted' : 'text-gray-500'
            }`} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{value}</span>
          {change && (
            <span className={`text-xs font-medium ${getChangeColor(change)}`}>{change}</span>
          )}
        </div>
        {tooltip && (
          <span className={`text-xs mt-1 ${
            isDark ? 'text-text-muted' : 'text-gray-500'
          }`}>{tooltip}</span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;