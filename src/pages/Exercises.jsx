// src/pages/Exercises.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Dumbbell, Loader, ArrowRight, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getExercises, createExercise } from '../services/api';

const ExerciseCard = ({ exercise }) => {
  const { theme } = useTheme();
  
  // Helper function to get difficulty badge styling
  const getDifficultyBadgeStyles = (difficulty) => {
    switch(difficulty) {
      case 'Advanced':
        return theme === 'dark' 
          ? 'bg-zinc-800 text-white border border-zinc-700' 
          : 'bg-black text-white';
      case 'Intermediate':
        return theme === 'dark' 
          ? 'bg-zinc-800/60 text-gray-300 border border-zinc-700/60' 
          : 'bg-gray-800 text-gray-100';
      default: // Beginner
        return theme === 'dark' 
          ? 'bg-dark-darker text-gray-400 border border-dark-border' 
          : 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 hover:shadow-md ${
      theme === 'dark' 
        ? 'bg-dark-card border-dark-border hover:border-gray-500/30' 
        : 'bg-white border-gray-200 hover:border-gray-400/30'
    }`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-text-light' : 'text-gray-900'
          }`}>
            {exercise.name}
          </h3>
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-dark-darker' : 'bg-gray-100'
          }`}>
            <Dumbbell className={`w-4 h-4 ${
              theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
            }`} />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
              Category
            </span>
            <span className={`font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-900'}`}>
              {exercise.category}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`text-sm ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
              Equipment
            </span>
            <span className={`font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-900'}`}>
              {exercise.equipment}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`text-sm ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
              Difficulty
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeStyles(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>
        </div>
        
        {exercise.description && (
          <div className="mt-4 pt-3 border-t border-opacity-50 border-gray-200">
            <p className={`text-sm ${theme === 'dark' ? 'text-text-muted' : 'text-gray-600'}`}>
              {exercise.description.length > 120 
                ? `${exercise.description.substring(0, 120)}...` 
                : exercise.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Exercises = () => {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get unique categories for filter
  const categories = ['All', ...new Set(exercises.map(ex => ex.category))].filter(Boolean);

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
    let filtered = exercises;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(exercise => 
        exercise.category === categoryFilter
      );
    }
    
    setFilteredExercises(filtered);
  }, [searchTerm, categoryFilter, exercises]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  // Placeholder for adding exercise functionality
  const handleAddExercise = () => {
    // You would implement a modal or form for adding exercises
    console.log('Add exercise clicked');
  };

  if (loading) {
    return (
      <div className={`p-8 min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
      }`}>
        <div className="text-center">
          <div className="relative inline-flex">
            <Loader className={`w-10 h-10 animate-spin ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <div className="absolute inset-0 h-full w-full flex items-center justify-center">
              <Dumbbell className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
          </div>
          <p className={`text-lg mt-4 font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-800'}`}>
            Loading exercise library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`relative rounded-xl mb-8 overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border border-dark-border'
            : 'bg-gradient-to-r from-gray-50 to-zinc-50 border border-gray-200'
        }`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-6 z-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-text-light' : 'text-gray-900'
                }`}>
                  Exercise Library
                </h1>
                <p className={`${
                  theme === 'dark' ? 'text-text-muted' : 'text-gray-600'
                }`}>
                  Browse and manage your exercise collection
                </p>
              </div>
              <button 
                onClick={handleAddExercise}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
                  transition-all duration-200 shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Exercise</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={handleSearch}
                className={`w-full pl-10 pr-4 py-3 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  theme === 'dark' 
                    ? 'bg-dark-card border border-dark-border text-text-light placeholder-text-muted' 
                    : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className={`pl-4 pr-8 py-3 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  theme === 'dark' 
                    ? 'bg-dark-card border border-dark-border text-text-light' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
              }`} />
            </div>
          </div>
          
          {/* Filter tags/chips */}
          {categoryFilter !== 'All' && (
            <div className="flex items-center">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
              }`}>Filters:</span>
              <div className={`ml-2 px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                theme === 'dark' 
                  ? 'bg-dark-darker text-text-light' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {categoryFilter}
                <button 
                  onClick={() => setCategoryFilter('All')}
                  className="ml-2 hover:opacity-75"
                >×</button>
              </div>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className={`p-5 rounded-xl mb-6 border ${
            theme === 'dark' 
              ? 'bg-red-900/20 border-red-800/30 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Please try again later.</p>
          </div>
        )}

        {/* Results count */}
        {!loading && !error && (
          <div className="flex justify-between items-center mb-4">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
            }`}>
              Showing {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            
            <button className={`text-sm font-medium flex items-center ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'
            }`}>
              View all exercises
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredExercises.length === 0 && (
          <div className={`text-center py-16 px-4 rounded-xl border ${
            theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
          }`}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-dark-darker' : 'bg-gray-100'
            }`}>
              <Dumbbell className={`w-8 h-8 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-text-light' : 'text-gray-900'
            }`}>
              No exercises found
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
            } max-w-md mx-auto mb-6`}>
              {searchTerm || categoryFilter !== 'All' 
                ? 'Try changing your search or filter criteria' 
                : 'Add your first exercise to get started'}
            </p>
            <button 
              onClick={handleAddExercise}
              className={`px-6 py-3 rounded-xl font-medium 
                transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add First Exercise
              </span>
            </button>
          </div>
        )}

        {/* Exercise Grid */}
        {!loading && !error && filteredExercises.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise._id} exercise={exercise} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;