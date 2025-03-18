// src/pages/Stats.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Dumbbell, 
  TrendingUp, 
  BarChart, 
  Activity, 
  Clock,
  ArrowLeft, 
  ArrowRight,
  Loader
} from 'lucide-react';
import { 
  getWeeklySummary, 
  getMonthlySummary, 
  getPerformanceMetrics 
} from '../services/api';
import WeeklyPerformanceChart from '../components/stats/WeeklyPerformanceChart';
import MonthlyPerformanceChart from '../components/stats/MonthlyPerformanceChart';
import MetricCard from '../components/stats/MetricCard';
import { useTheme } from '../context/ThemeContext';

const Stats = () => {
  const { isDark } = useTheme();
  const [period, setPeriod] = useState('current');
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data from API endpoints
        const weeklyResponse = await getWeeklySummary();
        const monthlyResponse = await getMonthlySummary();
        const metricsResponse = await getPerformanceMetrics();

        setWeeklyData(weeklyResponse.data);
        setMonthlyData(monthlyResponse.data);
        setMetrics(metricsResponse.data);
      } catch (err) {
        console.error('Error fetching stats data:', err);
        setError('Failed to load performance data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  // Time period selector
  const PeriodSelector = () => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setPeriod('previous')}
        className={`p-2 rounded-lg ${
          isDark ? 'hover:bg-[#1e293b]' : 'hover:bg-gray-100'
        }`}
      >
        <ArrowLeft className={`w-4 h-4 ${
          isDark ? 'text-[#94a3b8]' : 'text-gray-500'
        }`} />
      </button>
      <select 
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className={`px-3 py-2 rounded-lg text-sm font-medium border ${
          isDark 
            ? 'bg-[#0f172a] text-white border-[#2a334a]' 
            : 'bg-gray-50 text-gray-900 border-gray-200'
        }`}
      >
        <option value="previous">Previous Period</option>
        <option value="current">Current Period</option>
      </select>
      <button 
        onClick={() => setPeriod('current')}
        className={`p-2 rounded-lg ${
          isDark ? 'hover:bg-[#1e293b]' : 'hover:bg-gray-100'
        }`}
      >
        <ArrowRight className={`w-4 h-4 ${
          isDark ? 'text-[#94a3b8]' : 'text-gray-500'
        }`} />
      </button>
    </div>
  );

  return (
    <div className={`p-8 min-h-screen ${
      isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
    } transition-colors duration-200`}>
      {/* Header with period selector */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Performance Analytics
          </h1>
          <p className={`${
            isDark ? 'text-[#94a3b8]' : 'text-gray-500'
          }`}>
            Track your workout progress and performance metrics
          </p>
        </div>
        <PeriodSelector />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader className={`w-10 h-10 animate-spin mb-4 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading performance data...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={`p-4 rounded-lg mb-6 ${
          isDark ? 'bg-red-900/20 border border-red-800/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Check your connection or try again later.</p>
        </div>
      )}

      {/* Data display - only show when not loading and there's no error */}
      {!isLoading && !error && weeklyData.length > 0 && monthlyData.length > 0 && Object.keys(metrics).length > 0 && (
        <>
          {/* Key metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <MetricCard 
              title="Total Workouts" 
              value={metrics.totalWorkouts} 
              change={metrics.workoutChange}
              icon={Dumbbell}
            />
            <MetricCard 
              title="Total Volume" 
              value={metrics.totalVolume} 
              change={metrics.volumeChange}
              icon={TrendingUp}
            />
            <MetricCard 
              title="Avg Duration" 
              value={metrics.avgWorkoutDuration} 
              change={metrics.durationChange}
              icon={Clock}
            />
            <MetricCard 
              title="Weekly Frequency" 
              value={metrics.weeklyFrequency} 
              change={metrics.frequencyChange}
              icon={Calendar}
            />
            <MetricCard 
              title="Avg Intensity" 
              value={metrics.avgIntensity} 
              change={metrics.intensityChange}
              icon={Activity}
            />
            <MetricCard 
              title="Personal Records" 
              value={metrics.personalRecords} 
              change={metrics.recordsChange}
              icon={BarChart}
            />
          </div>

          {/* Weekly and Monthly performance charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WeeklyPerformanceChart data={weeklyData} />
            <MonthlyPerformanceChart data={monthlyData} />
          </div>
        </>
      )}

      {/* Empty state - no data but no error */}
      {!isLoading && !error && (weeklyData.length === 0 || monthlyData.length === 0 || Object.keys(metrics).length === 0) && (
        <div className={`text-center py-16 px-4 rounded-lg ${
          isDark ? 'bg-[#1e293b]' : 'bg-white'
        }`}>
          <BarChart className={`w-16 h-16 mx-auto mb-4 ${
            isDark ? 'text-[#94a3b8]' : 'text-gray-400'
          }`} />
          <h3 className={`text-xl font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>No workout data available</h3>
          <p className={`max-w-md mx-auto ${
            isDark ? 'text-[#94a3b8]' : 'text-gray-500'
          }`}>
            Start tracking your workouts to see performance analytics and progress over time.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;