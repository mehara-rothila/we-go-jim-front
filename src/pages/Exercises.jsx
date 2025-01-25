// src/pages/Exercises.jsx
import React from 'react';
import { Search, Filter, Plus, Dumbbell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const exercises = [
  {
    name: 'Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    difficulty: 'Intermediate'
  },
  {
    name: 'Squats',
    category: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate'
  },
  {
    name: 'Pull-ups',
    category: 'Back',
    equipment: 'Body Weight',
    difficulty: 'Advanced'
  },
  {
    name: 'Shoulder Press',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate'
  },
  {
    name: 'Deadlift',
    category: 'Back',
    equipment: 'Barbell',
    difficulty: 'Advanced'
  }
];

const Exercises = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Exercise Library
        </h1>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          isDark 
            ? 'bg-white text-[#0f172a] hover:bg-gray-100' 
            : 'bg-black text-white hover:bg-gray-800'
        }`}>
          <Plus className="w-4 h-4" />
          Add Exercise
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${
              isDark 
                ? 'bg-[#1e293b] text-white placeholder-[#94a3b8]' 
                : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-200'
            }`}
          />
        </div>
        <button className={`flex items-center gap-2 text-sm ${
          isDark ? 'text-[#94a3b8] hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}>
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-3 gap-4">
        {exercises.map((exercise, idx) => (
          <div key={idx} className={`rounded-xl p-4 ${
            isDark 
              ? 'bg-[#1e293b]' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {exercise.name}
              </h3>
              <button className={`p-2 rounded-lg ${
                isDark ? 'bg-[#1a2234]' : 'bg-gray-100'
              }`}>
                <Dumbbell className={`w-4 h-4 ${
                  isDark ? 'text-[#94a3b8]' : 'text-gray-500'
                }`} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={isDark ? 'text-[#94a3b8]' : 'text-gray-500'}>Category</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{exercise.category}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-[#94a3b8]' : 'text-gray-500'}>Equipment</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{exercise.equipment}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-[#94a3b8]' : 'text-gray-500'}>Difficulty</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  exercise.difficulty === 'Advanced'
                    ? 'bg-black text-white'
                    : isDark 
                      ? 'bg-[#1a2234] text-[#94a3b8]'
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;