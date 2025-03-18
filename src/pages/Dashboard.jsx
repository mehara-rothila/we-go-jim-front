// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { Dumbbell, Calendar, TrendingUp, History, Activity, Plus, ChevronRight, Loader } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getSchedules } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// These muscle groups will be used to categorize exercises
const muscleGroups = {
  'Chest': ['Bench Press', 'Push-ups', 'Dips', 'Chest Fly'],
  'Back': ['Pull-ups', 'Rows', 'Deadlift', 'Lat Pulldown'],
  'Shoulders': ['Shoulder Press', 'Military Press', 'Lateral Raises', 'Front Raises'],
  'Arms': ['Bicep Curl', 'Tricep Extension', 'Hammer Curl', 'Skull Crushers'],
  'Legs': ['Squats', 'Lunges', 'Leg Press', 'Leg Extension', 'Hamstring Curl'],
  'Core': ['Plank', 'Crunches', 'Leg Raises', 'Russian Twists', 'Ab Circuit']
};

const CustomTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`${
        isDark ? 'bg-[#0f172a]' : 'bg-white'
      } rounded-lg shadow-lg border ${
        isDark ? 'border-[#2a334a]' : 'border-gray-200'
      } p-3`}>
        <p className={`text-sm font-semibold mb-1 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{data.name}</p>
        <p className={`text-xs mb-2 ${
          isDark ? 'text-[#94a3b8]' : 'text-gray-500'
        }`}>{data.description}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${
            isDark ? 'text-[#94a3b8]' : 'text-gray-500'
          }`}>Strength:</span>
          <span className={`text-sm font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{data.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, icon: Icon, subtext }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl p-5 ${
      isDark ? 'bg-[#1e293b]' : 'bg-white shadow-sm'
    } transition-colors duration-200`}>
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <span className={`text-sm font-medium ${
            isDark ? 'text-[#94a3b8]' : 'text-gray-500'
          }`}>{title}</span>
          <div className={`ml-auto p-2 rounded-lg ${
            isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
          }`}>
            <Icon className={`w-4 h-4 ${
              isDark ? 'text-[#94a3b8]' : 'text-gray-500'
            }`} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{value}</span>
          {change && change !== '+0%' && (
            <span className="text-xs font-medium text-emerald-500">{change}</span>
          )}
          {subtext && (
            <span className={`text-xs ml-1 ${
              isDark ? 'text-[#94a3b8]' : 'text-gray-500'
            }`}>{subtext}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [stats, setStats] = useState({
    monthlyWorkouts: 0,
    weeklyTarget: '0/6',
    currentStreak: '0 days',
    volumeProgress: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get schedules from API
        const response = await getSchedules();
        setSchedules(response.data || []);
        
        // Process recent workouts
        processRecentWorkouts(response.data || []);
        
        // Calculate muscle group data
        calculateMuscleGroupData(response.data || []);
        
        // Calculate stats
        calculateStats(response.data || []);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process recent workouts from schedules
  const processRecentWorkouts = (schedules) => {
    // If no schedules or empty schedules array, set empty recent workouts
    if (!schedules || schedules.length === 0 || !schedules.some(s => s.workouts && s.workouts.length > 0)) {
      setRecentWorkouts([]);
      return;
    }
    
    // Flatten all workouts from all schedules
    const allWorkouts = [];
    
    schedules.forEach(schedule => {
      if (!schedule.workouts || !Array.isArray(schedule.workouts)) return;
      
      schedule.workouts.forEach(workout => {
        if (!workout.exercises || !Array.isArray(workout.exercises)) return;
        
        // Calculate total exercise volume
        let totalVolume = 0;
        let exerciseCount = 0;
        
        workout.exercises.forEach(exercise => {
          if (!exercise.sets || !Array.isArray(exercise.sets)) return;
          
          exercise.sets.forEach(set => {
            totalVolume += (set.reps * (set.weight || 0));
            exerciseCount++;
          });
        });
        
        // Determine intensity based on volume
        let intensity = 'Low';
        if (totalVolume > 2000) intensity = 'High';
        else if (totalVolume > 1000) intensity = 'Medium';
        
        // Format exercise list
        const exerciseList = workout.exercises.map(ex => {
          const setCount = ex.sets.length;
          const repCount = ex.sets[0]?.reps || 0;
          return `${ex.exerciseName} ${setCount}×${repCount}`;
        });
        
        // Add to workouts array
        allWorkouts.push({
          date: new Date().toISOString().split('T')[0], // Using today's date as placeholder
          type: `${workout.day} - ${schedule.name}`,
          exercises: exerciseList,
          duration: `${exerciseCount * 5} min`, // Rough estimate: 5 min per exercise
          intensity,
          totalVolume
        });
      });
    });
    
    // If no workouts were processed, return empty array
    if (allWorkouts.length === 0) {
      setRecentWorkouts([]);
      return;
    }
    
    // Sort by volume to determine which ones might have PRs
    allWorkouts.sort((a, b) => b.totalVolume - a.totalVolume);
    
    // Mark top 20% as having PRs
    const prCount = Math.max(1, Math.floor(allWorkouts.length * 0.2));
    for (let i = 0; i < prCount; i++) {
      if (allWorkouts[i]) {
        allWorkouts[i].personalRecords = `${Math.ceil(Math.random() * 3)} PR`;
      }
    }
    
    // Sort by date (most recent first) and take top 3
    allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentWorkouts(allWorkouts.slice(0, 3));
  };

  // Calculate muscle group data based on exercises in schedules
  const calculateMuscleGroupData = (schedules) => {
    // Initialize counters for each muscle group
    const muscleGroupCounts = {};
    let totalExercises = 0;
    
    // Initialize with all muscle groups
    Object.keys(muscleGroups).forEach(group => {
      muscleGroupCounts[group] = 0;
    });
    
    // If there are no schedules or no exercises, return a baseline value for all
    if (!schedules.length || !schedules.some(s => s.workouts && s.workouts.length > 0)) {
      const emptyData = Object.keys(muscleGroups).map(name => ({
        name,
        value: 0, // Set to 0 for new users
        fullMark: 100,
        description: muscleGroups[name].slice(0, 3).join(', ')
      }));
      
      setMuscleGroupData(emptyData);
      return;
    }
    
    // Count exercises by muscle group
    schedules.forEach(schedule => {
      if (!schedule.workouts || !Array.isArray(schedule.workouts)) return;
      
      schedule.workouts.forEach(workout => {
        if (!workout.exercises || !Array.isArray(workout.exercises)) return;
        
        workout.exercises.forEach(exercise => {
          if (!exercise.exerciseName) return;
          
          // Find which muscle group this exercise belongs to
          for (const [group, exercises] of Object.entries(muscleGroups)) {
            if (exercises.some(ex => exercise.exerciseName.toLowerCase().includes(ex.toLowerCase()))) {
              muscleGroupCounts[group] += 1;
              totalExercises += 1;
              break;
            }
          }
        });
      });
    });
    
    // If no exercises were matched to any muscle group
    if (totalExercises === 0) {
      const emptyData = Object.keys(muscleGroups).map(name => ({
        name,
        value: 0,
        fullMark: 100,
        description: muscleGroups[name].slice(0, 3).join(', ')
      }));
      
      setMuscleGroupData(emptyData);
      return;
    }
    
    // Create data for radar chart (normalized to percentages)
    const radarData = Object.entries(muscleGroupCounts).map(([name, count]) => {
      // Calculate a value between 50-95 based on the proportion
      const baseValue = 50 + (count / totalExercises) * 45;
      const value = Math.round(baseValue);
      
      // Get description from the muscleGroups object
      const exercises = muscleGroups[name];
      const description = exercises.slice(0, 3).join(', ');
      
      return {
        name,
        value,
        fullMark: 100,
        description
      };
    });
    
    setMuscleGroupData(radarData);
  };

  // Calculate stats for the dashboard
  const calculateStats = (schedules) => {
    // Count total workouts
    let totalWorkouts = 0;
    
    // Check if schedules has valid data
    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      setStats({
        monthlyWorkouts: 0,
        weeklyTarget: '0/6',
        currentStreak: '0 days',
        volumeProgress: '0%'
      });
      return;
    }
    
    schedules.forEach(schedule => {
      if (schedule.workouts && Array.isArray(schedule.workouts)) {
        totalWorkouts += schedule.workouts.length;
      }
    });
    
    // For new users with no data, show zeros
    if (totalWorkouts === 0) {
      setStats({
        monthlyWorkouts: 0,
        weeklyTarget: '0/6',
        currentStreak: '0 days',
        volumeProgress: '0%'
      });
      return;
    }
    
    // Weekly target (assuming 6 is the target)
    const weeklyTarget = `${Math.min(totalWorkouts, 5)}/6`;
    
    // Fake streak (1-14 days)
    const streak = Math.max(0, Math.min(totalWorkouts, 14));
    const currentStreak = `${streak} days`;
    
    // Volume progress (proportional to workout count, with minimum of 0%)
    const volumeProgressValue = Math.min(100, Math.max(0, totalWorkouts * 10));
    const volumeProgress = `${volumeProgressValue}%`;
    
    setStats({
      monthlyWorkouts: totalWorkouts,
      weeklyTarget,
      currentStreak,
      volumeProgress
    });
  };

  if (loading) {
    return (
      <div className={`p-8 min-h-screen flex items-center justify-center ${
        isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <Loader className={`w-10 h-10 animate-spin mx-auto mb-4 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-screen ${
      isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
    } transition-colors duration-200`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={`text-2xl font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user?.name || 'Athlete'}! 👋
          </h1>
          <p className={`${
            isDark ? 'text-[#94a3b8]' : 'text-gray-500'
          }`}>
            Let's crush today's workout goals.
          </p>
        </div>
        <Link to="/workouts">
          <button className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
            transition-all duration-200 ${
              isDark 
                ? 'bg-white text-[#0f172a] hover:bg-gray-100' 
                : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
            }`}>
            <Plus className="w-4 h-4" />
            <span>Start Workout</span>
          </button>
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className={`p-4 rounded-lg mb-6 ${
          isDark ? 'bg-red-900/20 border border-red-800/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Displaying sample data instead.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Monthly Workouts"
          value={stats.monthlyWorkouts.toString()}
          change={stats.monthlyWorkouts > 0 ? "+24%" : ""}
          icon={Dumbbell}
        />
        <StatCard 
          title="Weekly Target"
          value={stats.weeklyTarget}
          change={stats.monthlyWorkouts > 0 ? "+2" : ""}
          icon={Calendar}
        />
        <StatCard 
          title="Current Streak"
          value={stats.currentStreak}
          subtext={stats.monthlyWorkouts > 0 ? "Best: 14" : ""}
          icon={History}
        />
        <StatCard 
          title="Volume Progress"
          value={stats.volumeProgress}
          change={stats.monthlyWorkouts > 0 ? "+8%" : ""}
          icon={TrendingUp}
        />
      </div>

      {/* Radar Chart and Recent Workouts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Muscle Group Radar Chart */}
        <div className={`lg:col-span-2 rounded-xl p-5 ${
          isDark ? 'bg-[#1e293b]' : 'bg-white shadow-sm'
        } transition-colors duration-200`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`text-lg font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Muscle Group Progress</h2>
              <p className={`text-sm ${
                isDark ? 'text-[#94a3b8]' : 'text-gray-500'
              }`}>Current strength distribution</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm ${
                isDark ? 'text-[#94a3b8]' : 'text-gray-500'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-blue-500 opacity-30`}></div>
                <span>Current</span>
              </div>
              <select className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                isDark 
                  ? 'bg-[#0f172a] text-white border-[#2a334a]' 
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              }`}>
                <option>Current Progress</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>
          
          {schedules.length > 0 && muscleGroupData.length > 0 && muscleGroupData.some(item => item.value > 0) ? (
            <>
              <div className="h-[350px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={muscleGroupData}>
                    <PolarGrid 
                      stroke={isDark ? '#2a334a' : '#e5e7eb'} 
                      strokeDasharray="3 3"
                    />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ 
                        fill: isDark ? '#94a3b8' : '#6b7280',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                      stroke={isDark ? '#2a334a' : '#e5e7eb'}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]}
                      tick={{ 
                        fill: isDark ? '#94a3b8' : '#6b7280',
                        fontSize: 10
                      }}
                      stroke={isDark ? '#2a334a' : '#e5e7eb'}
                    />
                    <Radar 
                      name="Strength" 
                      dataKey="value" 
                      stroke={isDark ? '#60a5fa' : '#3b82f6'} 
                      strokeWidth={2}
                      fill={isDark ? '#60a5fa' : '#3b82f6'} 
                      fillOpacity={0.3}
                    />
                    <Tooltip content={<CustomTooltip isDark={isDark} />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Muscle Group Legend */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {muscleGroupData.map(({ name, value, description }) => (
                  <div key={name} className={`flex flex-col p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
                    isDark ? 'bg-[#0f172a] hover:bg-[#1e293b]' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{name}</span>
                      <span className={`text-sm font-bold ${
                        value === 0 ? (isDark ? 'text-gray-500' : 'text-gray-400') :
                        value >= 80 ? 'text-green-500' : 
                        value >= 60 ? 'text-blue-500' : 
                        'text-yellow-500'
                      }`}>{value}%</span>
                    </div>
                    <span className={`text-xs ${
                      isDark ? 'text-[#94a3b8]' : 'text-gray-500'
                    }`}>{description}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <div className="text-center">
                <Activity className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#94a3b8]' : 'text-gray-400'}`} />
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                  No workout data yet
                </p>
                <p className={`${isDark ? 'text-[#94a3b8]' : 'text-gray-500'} text-sm mt-1`}>
                  Add workouts to see your muscle group progress
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        <div className={`rounded-xl p-5 ${
          isDark ? 'bg-[#1e293b]' : 'bg-white shadow-sm'
        } transition-colors duration-200`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-lg font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Recent Workouts</h2>
              <p className={`text-sm ${
                isDark ? 'text-[#94a3b8]' : 'text-gray-500'
              }`}>
                {recentWorkouts.filter(w => w.personalRecords).length} Personal Records this week
              </p>
            </div>
            <Link to="/workouts">
              <button className="text-blue-400 hover:text-blue-500 transition-colors flex items-center text-sm font-medium">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>
          
          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map((workout, idx) => (
                <div key={idx} className={`rounded-lg p-4 ${
                  isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
                }`}>
                  <div className="flex gap-4">
                    <div className={`p-2 rounded-lg h-min ${
                      isDark ? 'bg-[#1e293b]' : 'bg-white'
                    }`}>
                      <Activity className={`w-4 h-4 ${
                        isDark ? 'text-[#94a3b8]' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{workout.type}</h3>
                        {workout.personalRecords && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isDark 
                              ? 'bg-white text-[#0f172a]'
                              : 'bg-[#0f172a] text-white'
                          }`}>
                            {workout.personalRecords}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${
                        isDark ? 'text-[#94a3b8]' : 'text-gray-500'
                      }`}>{workout.date}</p>
                      <p className="text-blue-400 text-sm mt-2">
                        {workout.exercises.slice(0, 3).join(' · ')}
                        {workout.exercises.length > 3 && ' · ...'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-sm ${
                          isDark ? 'text-[#94a3b8]' : 'text-gray-500'
                        }`}>{workout.duration}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          workout.intensity === 'High'
                            ? isDark 
                              ? 'bg-white text-[#0f172a]'
                              : 'bg-[#0f172a] text-white'
                            : isDark
                              ? 'bg-[#1e293b] text-[#94a3b8]'
                              : 'bg-white text-gray-500'
                        }`}>
                          {workout.intensity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Activity className={`w-12 h-12 mb-3 ${isDark ? 'text-[#94a3b8]' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium mb-1`}>
                No recent workouts
              </p>
              <p className={`${isDark ? 'text-[#94a3b8]' : 'text-gray-500'} text-sm text-center`}>
                Start tracking your workouts to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;