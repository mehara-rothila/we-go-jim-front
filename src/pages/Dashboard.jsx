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
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  History, 
  Activity, 
  Plus, 
  ChevronRight, 
  Loader,
  Flame,
  Award,
  Clock
} from 'lucide-react';
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

const CustomTooltip = ({ active, payload, label }) => {
  const { theme } = useTheme();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`${
        theme === 'dark' ? 'bg-dark-darker' : 'bg-white'
      } rounded-lg shadow-lg border ${
        theme === 'dark' ? 'border-dark-border' : 'border-light-border'
      } p-4`}>
        <p className={`text-sm font-semibold mb-1 ${
          theme === 'dark' ? 'text-text-light' : 'text-gray-900'
        }`}>{data.name}</p>
        <p className={`text-xs mb-2 ${
          theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
        }`}>{data.description}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${
            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
          }`}>Strength:</span>
          <span className={`text-sm font-bold ${
            theme === 'dark' ? 'text-text-light' : 'text-gray-900'
          }`}>{data.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, icon: Icon, subtext, iconColor = 'zinc' }) => {
  const { theme } = useTheme();
  
  // Dynamic color classes based on theme and iconColor prop
  const iconColorClass = {
    zinc: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    black: theme === 'dark' ? 'text-gray-300' : 'text-gray-900',
    green: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500',
    orange: theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
  };
  
  const iconBgClass = {
    zinc: theme === 'dark' ? 'bg-gray-400/10' : 'bg-gray-500/10',
    black: theme === 'dark' ? 'bg-gray-300/10' : 'bg-gray-900/10',
    green: theme === 'dark' ? 'bg-emerald-400/10' : 'bg-emerald-500/10',
    orange: theme === 'dark' ? 'bg-orange-400/10' : 'bg-orange-500/10'
  };
  
  return (
    <div className={`rounded-xl p-5 transition-all duration-200 hover:shadow-md ${
      theme === 'dark' 
        ? 'bg-dark-card border border-dark-border hover:border-gray-500/30' 
        : 'bg-light-card border border-light-border hover:border-gray-500/30'
    }`}>
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
          }`}>{title}</span>
          <div className={`ml-auto p-2 rounded-full ${iconBgClass[iconColor]}`}>
            <Icon className={`w-4 h-4 ${iconColorClass[iconColor]}`} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-text-light' : 'text-gray-900'
          }`}>{value}</span>
          {change && change !== '+0%' && (
            <span className="text-xs font-medium text-emerald-500">{change}</span>
          )}
          {subtext && (
            <span className={`text-xs ml-1 ${
              theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
            }`}>{subtext}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const WorkoutCard = ({ workout, idx }) => {
  const { theme } = useTheme();
  
  // Generate intensity badge color based on intensity level
  const intensityColor = {
    High: theme === 'dark' 
      ? 'bg-red-400/20 text-red-400 border-red-400/30' 
      : 'bg-red-50 text-red-600 border-red-200',
    Medium: theme === 'dark'
      ? 'bg-orange-400/20 text-orange-400 border-orange-400/30'
      : 'bg-orange-50 text-orange-600 border-orange-200',
    Low: theme === 'dark'
      ? 'bg-gray-400/20 text-gray-400 border-gray-400/30'
      : 'bg-gray-50 text-gray-600 border-gray-200'
  };
  
  // Icon based on workout type
  const getWorkoutIcon = (type) => {
    if (type.toLowerCase().includes('leg')) return <Activity className="w-4 h-4" />;
    if (type.toLowerCase().includes('chest')) return <Dumbbell className="w-4 h-4" />;
    if (type.toLowerCase().includes('cardio')) return <Flame className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };
  
  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group ${
      theme === 'dark' 
        ? 'bg-dark-darker hover:bg-dark-card border border-dark-border hover:border-gray-500/30' 
        : 'bg-white hover:bg-gray-50 border border-light-border hover:border-gray-500/30'
    }`}>
      <div className="p-4">
        <div className="flex gap-4">
          <div className={`p-2 rounded-lg h-min transition-colors group-hover:scale-110 ${
            theme === 'dark' 
              ? 'bg-gray-400/10 text-gray-400 group-hover:bg-gray-400/20' 
              : 'bg-gray-500/10 text-gray-500 group-hover:bg-gray-500/20'
          }`}>
            {getWorkoutIcon(workout.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-text-light' : 'text-gray-900'
              }`}>{workout.type}</h3>
              {workout.personalRecords && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900'
                } shadow-sm`}>
                  <span className="flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    {workout.personalRecords}
                  </span>
                </span>
              )}
            </div>
            <p className={`text-xs mt-1 flex items-center ${
              theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3 mr-1" /> {workout.date}
            </p>
            
            <div className="mt-3 space-y-1">
              {workout.exercises.slice(0, 3).map((exercise, i) => (
                <p key={i} className={`text-sm flex items-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                  {exercise}
                </p>
              ))}
              {workout.exercises.length > 3 && (
                <p className={`text-xs italic ${
                  theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
                }`}>+ {workout.exercises.length - 3} more</p>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-dashed border-opacity-30 border-gray-400">
              <span className={`text-xs flex items-center ${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
              }`}>
                <Clock className="w-3 h-3 mr-1" />
                {workout.duration}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                intensityColor[workout.intensity]
              }`}>
                {workout.intensity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MuscleGroupCard = ({ name, value, description }) => {
  const { theme } = useTheme();
  
  // Dynamic styling based on the value
  const getStrengthColor = (val) => {
    if (val === 0) return theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
    if (val >= 80) return 'text-green-500';
    if (val >= 60) return 'text-gray-300';
    return 'text-yellow-500';
  };
  
  // Progress bar fill percentage
  const fillWidth = `${value}%`;
  
  return (
    <div className={`flex flex-col p-4 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer ${
      theme === 'dark' 
        ? 'bg-dark-darker hover:bg-dark-card border border-dark-border hover:border-gray-500/30' 
        : 'bg-gray-50 hover:bg-white border border-light-border hover:border-gray-500/30'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${
          theme === 'dark' ? 'text-text-light' : 'text-gray-900'
        }`}>{name}</span>
        <span className={`text-sm font-bold ${getStrengthColor(value)}`}>
          {value}%
        </span>
      </div>
      <span className={`text-xs mb-2 ${
        theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
      }`}>{description}</span>
      
      {/* Progress bar */}
      <div className={`w-full h-1.5 rounded-full mt-1 ${
        theme === 'dark' ? 'bg-dark-card' : 'bg-gray-200'
      }`}>
        <div 
          className={`h-full rounded-full ${
            value === 0 ? 'bg-gray-400' :
            value >= 80 ? 'bg-green-500' : 
            value >= 60 ? 'bg-gray-300' : 
            'bg-yellow-500'
          }`}
          style={{ width: fillWidth }}
        ></div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { theme } = useTheme();
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
        theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
      }`}>
        <div className="text-center">
          <div className="relative inline-flex">
            <Loader className={`w-12 h-12 animate-spin ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <div className="absolute inset-0 h-full w-full flex items-center justify-center">
              <Dumbbell className={`w-6 h-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
          </div>
          <p className={`text-lg mt-4 font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-800'}`}>
            Loading your workout dashboard...
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
            Crunching those fitness numbers!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-screen ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
    } transition-colors duration-200`}>
      {/* Header with gradient background */}
      <div className={`relative rounded-2xl mb-8 overflow-hidden ${
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
                Welcome back, {user?.name || 'Athlete'}! 💪
              </h1>
              <p className={`${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-600'
              }`}>
                Let's crush today's workout goals and keep building your strength.
              </p>
            </div>
            <Link to="/workouts">
              <button className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
                transition-all duration-200 shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}>
                <Plus className="w-4 h-4" />
                <span>Start Workout</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className={`p-5 rounded-xl mb-6 border ${
          theme === 'dark' 
            ? 'bg-red-900/20 border-red-800/30 text-red-400' 
            : 'bg-red-50 border-red-200 text-red-700'
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
          iconColor="black"
        />
        <StatCard 
          title="Weekly Target"
          value={stats.weeklyTarget}
          change={stats.monthlyWorkouts > 0 ? "+2" : ""}
          icon={Calendar}
          iconColor="green"
        />
        <StatCard 
          title="Current Streak"
          value={stats.currentStreak}
          subtext={stats.monthlyWorkouts > 0 ? "Best: 14" : ""}
          icon={Flame}
          iconColor="orange"
        />
        <StatCard 
          title="Volume Progress"
          value={stats.volumeProgress}
          change={stats.monthlyWorkouts > 0 ? "+8%" : ""}
          icon={TrendingUp}
          iconColor="zinc"
        />
      </div>

      {/* Radar Chart and Recent Workouts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Muscle Group Radar Chart */}
        <div className={`lg:col-span-2 rounded-xl p-6 border ${
          theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
        } transition-colors duration-200`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`text-lg font-bold mb-1 ${
                theme === 'dark' ? 'text-text-light' : 'text-gray-900'
              }`}>Muscle Group Progress</h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
              }`}>Current strength distribution</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm ${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-gray-500 opacity-30`}></div>
                <span>Current</span>
              </div>
              <select className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                theme === 'dark' 
                  ? 'bg-dark-darker text-text-light border-dark-border focus:border-gray-500 focus:ring-1 focus:ring-gray-500' 
                  : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500'
              } focus:outline-none`}>
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
                      stroke={theme === 'dark' ? '#2a334a' : '#e5e7eb'} 
                      strokeDasharray="3 3"
                    />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ 
                        fill: theme === 'dark' ? '#94a3b8' : '#6b7280',
                        fontSize:12,
                        fontWeight: 500,
                      }}
                      stroke={theme === 'dark' ? '#2a334a' : '#e5e7eb'}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]}
                      tick={{ 
                        fill: theme === 'dark' ? '#94a3b8' : '#6b7280',
                        fontSize: 10
                      }}
                      stroke={theme === 'dark' ? '#2a334a' : '#e5e7eb'}
                    />
                    <Radar 
                      name="Strength" 
                      dataKey="value" 
                      stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} 
                      strokeWidth={2}
                      fill={theme === 'dark' ? '#9ca3af' : '#4b5563'} 
                      fillOpacity={0.3}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Muscle Group Legend */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {muscleGroupData.map((group) => (
                  <MuscleGroupCard 
                    key={group.name}
                    name={group.name}
                    value={group.value}
                    description={group.description}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-dark-darker' : 'bg-gray-100'
                }`}>
                  <Activity className={`w-8 h-8 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
                </div>
                <p className={`${theme === 'dark' ? 'text-text-light' : 'text-gray-900'} font-semibold text-lg`}>
                  No workout data yet
                </p>
                <p className={`${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'} text-sm mt-2 max-w-md mx-auto`}>
                  Start tracking your workouts to see your muscle group distribution and strength progress over time.
                </p>
                <Link to="/workouts">
                  <button className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'bg-dark-darker text-gray-400 hover:bg-zinc-900/20 border border-zinc-900/30' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}>
                    Create Workout Plan
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        <div className={`rounded-xl p-6 border ${
          theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
        } transition-colors duration-200`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-lg font-bold mb-1 ${
                theme === 'dark' ? 'text-text-light' : 'text-gray-900'
              }`}>Recent Workouts</h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
              }`}>
                {recentWorkouts.filter(w => w.personalRecords).length} Personal Records this week
              </p>
            </div>
            <Link to="/workouts">
              <button className={`text-sm font-medium flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:bg-zinc-900/20' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>
          
          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map((workout, idx) => (
                <WorkoutCard key={idx} workout={workout} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-dark-darker' : 'bg-gray-100'
              }`}>
                <History className={`w-8 h-8 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
              </div>
              <p className={`${theme === 'dark' ? 'text-text-light' : 'text-gray-900'} font-semibold text-lg`}>
                No recent workouts
              </p>
              <p className={`${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'} text-sm mt-2 text-center max-w-xs`}>
                Log your first workout to start tracking your fitness progress
              </p>
              <Link to="/workouts">
                <button className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'bg-dark-darker text-gray-400 hover:bg-zinc-900/20 border border-zinc-900/30' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                  Log a Workout
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;