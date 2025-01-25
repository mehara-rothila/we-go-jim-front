// src/pages/Dashboard.jsx
import React from 'react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Dumbbell, Calendar, TrendingUp, History, Activity, Plus, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const muscleGroupData = [
  {
    name: 'Chest',
    value: 85,
    fullMark: 100,
    description: 'Bench Press, Dips, Push-ups'
  },
  {
    name: 'Back',
    value: 78,
    fullMark: 100,
    description: 'Pull-ups, Rows, Deadlifts'
  },
  {
    name: 'Shoulders',
    value: 70,
    fullMark: 100,
    description: 'Military Press, Lateral Raises'
  },
  {
    name: 'Arms',
    value: 75,
    fullMark: 100,
    description: 'Curls, Tricep Extensions'
  },
  {
    name: 'Legs',
    value: 82,
    fullMark: 100,
    description: 'Squats, Lunges, Leg Press'
  },
  {
    name: 'Core',
    value: 68,
    fullMark: 100,
    description: 'Planks, Crunches, Leg Raises'
  },
];

const recentWorkouts = [
  { 
    date: '2025-01-16', 
    type: 'Upper Body Power',
    exercises: ['Bench Press 5×5', 'OHP 4×8', 'Dips'],
    duration: '78 min',
    intensity: 'High',
    personalRecords: '2 PR'
  },
  { 
    date: '2025-01-15', 
    type: 'Cardio + Core',
    exercises: ['Intervals', 'Plank', 'Ab Circuit'],
    duration: '45 min',
    intensity: 'Medium'
  },
  { 
    date: '2025-01-13', 
    type: 'Leg Day',
    exercises: ['Squats 5×3', 'RDL', 'Press'],
    duration: '92 min',
    intensity: 'High',
    personalRecords: '3 PR'
  },
];

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
          {change && (
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
            Welcome back, John! 👋
          </h1>
          <p className={`${
            isDark ? 'text-[#94a3b8]' : 'text-gray-500'
          }`}>
            Let's crush today's workout goals.
          </p>
        </div>
        <button className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
          transition-all duration-200 ${
            isDark 
              ? 'bg-white text-[#0f172a] hover:bg-gray-100' 
              : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
          }`}>
          <Plus className="w-4 h-4" />
          <span>Start Workout</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Monthly Workouts"
          value="16"
          change="+24%"
          icon={Dumbbell}
        />
        <StatCard 
          title="Weekly Target"
          value="5/6"
          change="+2"
          icon={Calendar}
        />
        <StatCard 
          title="Current Streak"
          value="8 days"
          subtext="Best: 14"
          icon={History}
        />
        <StatCard 
          title="Volume Progress"
          value="92%"
          change="+8%"
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
              }`}>5 Personal Records this week</p>
            </div>
            <button className="text-blue-400 hover:text-blue-500 transition-colors flex items-center text-sm font-medium">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
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
                          {workout.personalRecords}</span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      isDark ? 'text-[#94a3b8]' : 'text-gray-500'
                    }`}>{workout.date}</p>
                    <p className="text-blue-400 text-sm mt-2">{workout.exercises.join(' · ')}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;