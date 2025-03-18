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
  const { theme } = useTheme();
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
        className={`p-2 rounded-lg transition-colors ${
          theme === 'dark' 
            ? 'hover:bg-dark-darker text-text-muted hover:text-text-light' 
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <select 
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className={`px-3 py-2 rounded-lg text-sm font-medium border ${
          theme === 'dark' 
            ? 'bg-dark-darker text-text-light border-dark-border focus:border-gray-500 focus:ring-1 focus:ring-gray-500' 
            : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500'
        } focus:outline-none`}
      >
        <option value="previous">Previous Period</option>
        <option value="current">Current Period</option>
      </select>
      <button 
        onClick={() => setPeriod('current')}
        className={`p-2 rounded-lg transition-colors ${
          theme === 'dark' 
            ? 'hover:bg-dark-darker text-text-muted hover:text-text-light' 
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
        }`}
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className={`p-8 min-h-screen ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
    } transition-colors duration-200`}>
      {/* Header with period selector */}
      <div className={`relative rounded-xl mb-8 overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border border-dark-border'
          : 'bg-gradient-to-r from-gray-50 to-zinc-50 border border-gray-200'
      }`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-6 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-text-light' : 'text-gray-900'
              }`}>
                Performance Analytics
              </h1>
              <p className={`${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-600'
              }`}>
                Track your workout progress and performance metrics
              </p>
            </div>
            <PeriodSelector />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative inline-flex">
            <Loader className={`w-10 h-10 animate-spin ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <div className="absolute inset-0 h-full w-full flex items-center justify-center">
              <BarChart className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
          </div>
          <p className={`text-lg mt-4 font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-800'}`}>
            Loading performance data...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={`p-5 rounded-xl mb-6 border ${
          theme === 'dark' 
            ? 'bg-red-900/20 border-red-800/30 text-red-400' 
            : 'bg-red-50 border-red-200 text-red-700'
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
              theme={theme}
              iconColor="black"
            />
            <MetricCard 
              title="Total Volume" 
              value={metrics.totalVolume} 
              change={metrics.volumeChange}
              icon={TrendingUp}
              theme={theme}
              iconColor="zinc"
            />
            <MetricCard 
              title="Avg Duration" 
              value={metrics.avgWorkoutDuration} 
              change={metrics.durationChange}
              icon={Clock}
              theme={theme}
              iconColor="zinc"
            />
            <MetricCard 
              title="Weekly Frequency" 
              value={metrics.weeklyFrequency} 
              change={metrics.frequencyChange}
              icon={Calendar}
              theme={theme}
              iconColor="green"
            />
            <MetricCard 
              title="Avg Intensity" 
              value={metrics.avgIntensity} 
              change={metrics.intensityChange}
              icon={Activity}
              theme={theme}
              iconColor="orange"
            />
            <MetricCard 
              title="Personal Records" 
              value={metrics.personalRecords} 
              change={metrics.recordsChange}
              icon={BarChart}
              theme={theme}
              iconColor="black"
            />
          </div>

          {/* Weekly and Monthly performance charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`rounded-xl p-6 border ${
              theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
            } transition-colors duration-200`}>
              <WeeklyPerformanceChart data={weeklyData} theme={theme} />
            </div>
            <div className={`rounded-xl p-6 border ${
              theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
            } transition-colors duration-200`}>
              <MonthlyPerformanceChart data={monthlyData} theme={theme} />
            </div>
          </div>
        </>
      )}

      {/* Empty state - no data but no error */}
      {!isLoading && !error && (weeklyData.length === 0 || monthlyData.length === 0 || Object.keys(metrics).length === 0) && (
        <div className={`text-center py-16 px-4 rounded-xl border ${
          theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
        }`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-dark-darker' : 'bg-gray-100'
          }`}>
            <BarChart className={`w-8 h-8 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-text-light' : 'text-gray-900'
          }`}>No workout data available</h3>
          <p className={`max-w-md mx-auto ${
            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
          }`}>
            Start tracking your workouts to see performance analytics and progress over time.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;