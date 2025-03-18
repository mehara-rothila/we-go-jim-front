// src/pages/Exercises.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Dumbbell, Loader } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getExercises, createExercise } from '../services/api';

const Exercises = () => {
  const { isDark } = useTheme();
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await getExercises();
        setExercises(response.data);
        setFilteredExercises(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchTerm, exercises]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Placeholder for adding exercise functionality
  const handleAddExercise = () => {
    // You would implement a modal or form for adding exercises
    console.log('Add exercise clicked');
  };

  if (loading) {
    return (
      <div className={`p-6 flex justify-center items-center h-screen ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <Loader className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`p-6 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Exercise Library
        </h1>
        <button 
          onClick={handleAddExercise}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isDark 
              ? 'bg-white text-[#0f172a] hover:bg-gray-100' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
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
            value={searchTerm}
            onChange={handleSearch}
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

      {/* Error state */}
      {error && (
        <div className={`p-4 rounded-lg mb-6 ${
          isDark ? 'bg-red-900/20 border border-red-800/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#94a3b8]' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No exercises found
          </h3>
          <p className={`${isDark ? 'text-[#94a3b8]' : 'text-gray-500'} max-w-md mx-auto`}>
            {searchTerm ? 'Try a different search term' : 'Add your first exercise to get started'}
          </p>
        </div>
      )}

      {/* Exercise Grid */}
      {!loading && !error && filteredExercises.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className={`rounded-xl p-4 ${
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
                {exercise.description && (
                  <div className="mt-3">
                    <span className={`text-sm ${isDark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                      {exercise.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exercises;