// src/data/workoutData.js

export const chartData = [
    { name: 'Mon', value: 62 },
    { name: 'Tue', value: 85 },
    { name: 'Wed', value: 45 },
    { name: 'Thu', value: 92 },
    { name: 'Fri', value: 75 },
    { name: 'Sat', value: 108 },
    { name: 'Sun', value: 55 },
  ];
  
  export const recentWorkouts = [
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
      intensity: 'Medium',
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
  
  export const statCards = [
    { 
      title: 'Monthly Workouts', 
      value: '16', 
      subtext: '+24%', 
      icon: 'Dumbbell' 
    },
    { 
      title: 'Weekly Target', 
      value: '5/6', 
      subtext: '+2', 
      icon: 'Calendar' 
    },
    { 
      title: 'Current Streak', 
      value: '8 days', 
      subtext: 'Best: 14', 
      icon: 'History' 
    },
    { 
      title: 'Volume Progress', 
      value: '92%', 
      subtext: '+8%', 
      icon: 'TrendingUp' 
    },
  ];