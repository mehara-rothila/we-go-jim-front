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
  ArrowRight
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
        
        // For demo purposes, we'll use mock data
        // In a real app, you would uncomment these lines to fetch from the API
        // const weeklyResponse = await getWeeklySummary();
        // const monthlyResponse = await getMonthlySummary();
        // const metricsResponse = await getPerformanceMetrics();

        // Mock weekly data
        const mockWeeklyData = [
          { day: 'Monday', totalVolume: 2450, totalSets: 18, avgWeight: 75 },
          { day: 'Tuesday', totalVolume: 0, totalSets: 0, avgWeight: 0 },
          { day: 'Wednesday', totalVolume: 3100, totalSets: 24, avgWeight: 82 },
          { day: 'Thursday', totalVolume: 0, totalSets: 0, avgWeight: 0 },
          { day: 'Friday', totalVolume: 2800, totalSets: 20, avgWeight: 78 },
          { day: 'Saturday', totalVolume: 3500, totalSets: 28, avgWeight: 85 },
          { day: 'Sunday', totalVolume: 0, totalSets: 0, avgWeight: 0 },
        ];

        // Mock monthly data
        const mockMonthlyData = [
          { week: 'Week 1', totalVolume: 8250, workoutCount: 3, averageIntensity: 75 },
          { week: 'Week 2', totalVolume: 10500, workoutCount: 4, averageIntensity: 80 },
          { week: 'Week 3', totalVolume: 9350, workoutCount: 3, averageIntensity: 85 },
          { week: 'Week 4', totalVolume: 11850, workoutCount: 4, averageIntensity: 82 },
        ];

        // Mock metrics
        const mockMetrics = {
          totalWorkouts: 14,
          workoutChange: '+2',
          totalVolume: '39,950 kg',
          volumeChange: '+8.5%',
          avgWorkoutDuration: '65 min',
          durationChange: '+5 min',
          weeklyFrequency: '3.5',
          frequencyChange: '+0.5',
          avgIntensity: '81%',
          intensityChange: '+3%',
          personalRecords: 8,
          recordsChange: '+3'
        };

        setWeeklyData(mockWeeklyData);
        setMonthlyData(mockMonthlyData);
        setMetrics(mockMetrics);
      } catch (err) {
        setError('Failed to load performance data');
        console.error(err);
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
          isDark ? 'hover:bg-dark-card' : 'hover:bg-gray-100'
        }`}
      >
        <ArrowLeft className={`w-4 h-4 ${
          isDark ? 'text-text-muted' : 'text-gray-500'
        }`} />
      </button>
      <select 
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className={`px-3 py-2 rounded-lg text-sm font-medium border ${
          isDark 
            ? 'bg-dark-darker text-white border-dark-border' 
            : 'bg-gray-50 text-gray-900 border-gray-200'
        }`}
      >
        <option value="previous">Previous Period</option>
        <option value="current">Current Period</option>
      </select>
      <button 
        onClick={() => setPeriod('current')}
        className={`p-2 rounded-lg ${
          isDark ? 'hover:bg-dark-card' : 'hover:bg-gray-100'
        }`}
      >
        <ArrowRight className={`w-4 h-4 ${
          isDark ? 'text-text-muted' : 'text-gray-500'
        }`} />
      </button>
    </div>
  );

  return (
    <div className={`p-8 min-h-screen ${
      isDark ? 'bg-dark-darker' : 'bg-gray-50'
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
            isDark ? 'text-text-muted' : 'text-gray-500'
          }`}>
            Track your workout progress and performance metrics
          </p>
        </div>
        <PeriodSelector />
      </div>

      {/* Loading and error states */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading performance data...
          </p>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
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

          {/* Future additions: Muscle group focus, exercise progress, personal records */}
        </>
      )}
    </div>
  );
};

export default Stats;