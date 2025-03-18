// src/pages/Workouts.jsx
import React, { useState } from 'react';
import { Search, Filter, Plus, Loader, Trash, Edit2, Calendar, Scale } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSchedules } from '../hooks/useSchedules';
import EditScheduleModal from '../components/workouts/EditScheduleModal';
import api from '../services/api';

const Workouts = () => {
    const { theme } = useTheme();
    const { schedules, loading, error, fetchSchedules, addSchedule } = useSchedules();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [editingName, setEditingName] = useState(null);
    
    // Weight unit state
    const [weightUnit, setWeightUnit] = useState(() => {
        return localStorage.getItem('weightUnit') || 'kg';
    });

    // Function to toggle between kg and lbs
    const toggleWeightUnit = () => {
        const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
        localStorage.setItem('weightUnit', newUnit);
        setWeightUnit(newUnit);
    };

    // Function to convert weight based on selected unit
    const convertWeight = (weight) => {
        if (weightUnit === 'lbs') {
            // Convert kg to lbs (1 kg ≈ 2.20462 lbs)
            return (weight * 2.20462).toFixed(1);
        }
        return weight;
    };

    const handleAddSchedule = async () => {
        try {
            const newSchedule = {
                name: "New Workout Schedule",
                workouts: [
                    {
                        day: "Monday",
                        exercises: [
                            {
                                exerciseName: "Bench Press",
                                sets: [
                                    {
                                        setNumber: 1,
                                        reps: 12
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
            await addSchedule(newSchedule);
        } catch (error) {
            console.error('Failed to add schedule:', error);
        }
    };

    const handleNameEdit = async (scheduleId, newName) => {
        try {
            if (!newName.trim()) {
                setEditingName(null);
                return;
            }

            await api.put(`/schedules/${scheduleId}`, {
                name: newName.trim()
            });
            await fetchSchedules();
            setEditingName(null);
        } catch (error) {
            console.error('Failed to update schedule name:', error);
        }
    };

    const handleDelete = async (scheduleId) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                await api.delete(`/schedules/${scheduleId}`);
                await fetchSchedules();
            } catch (error) {
                console.error('Failed to delete schedule:', error);
            }
        }
    };

    const handleSaveEdit = async (updatedSchedule) => {
        try {
            await api.put(`/schedules/${updatedSchedule._id}`, {
                workouts: updatedSchedule.workouts
            });
            await fetchSchedules();
            setEditingSchedule(null);
        } catch (error) {
            console.error('Failed to update schedule:', error);
        }
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${
                theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
            }`}>
                <div className="text-center">
                    <div className="relative inline-flex">
                        <Loader className={`w-10 h-10 animate-spin ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <div className="absolute inset-0 h-full w-full flex items-center justify-center">
                            <Calendar className={`w-5 h-5 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                        </div>
                    </div>
                    <p className={`text-lg mt-4 font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-800'}`}>
                        Loading your workout schedules...
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
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className={`text-2xl font-bold mb-2 ${
                                    theme === 'dark' ? 'text-text-light' : 'text-gray-900'
                                }`}>
                                    Your Workout Schedules
                                </h1>
                                <p className={`${
                                    theme === 'dark' ? 'text-text-muted' : 'text-gray-600'
                                }`}>
                                    Create and manage your workout routines
                                </p>
                            </div>
                            <button 
                                onClick={handleAddSchedule}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
                                    transition-all duration-200 shadow-sm ${
                                    theme === 'dark' 
                                        ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                                        : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Schedule</span>
                            </button>
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
                        <p className="font-medium">Error: {error}</p>
                        <p className="text-sm mt-1">Unable to load workout schedules.</p>
                    </div>
                )}

                {/* Search Bar and Weight Unit Toggle */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                            theme === 'dark' ? 'text-text-muted' : 'text-gray-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Search schedules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                                theme === 'dark' 
                                    ? 'bg-dark-card border border-dark-border text-text-light placeholder-text-muted' 
                                    : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                    </div>
                    
                    {/* Weight Unit Toggle Button */}
                    <button
                        onClick={toggleWeightUnit}
                        className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 
                            transition-all duration-200 ${
                            theme === 'dark' 
                                ? 'bg-dark-card border border-dark-border text-text-light hover:bg-dark-darker' 
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Scale className="w-4 h-4" />
                        <span>{weightUnit.toUpperCase()}</span>
                    </button>
                </div>

                {/* Schedule Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules
                        .filter(schedule => 
                            schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((schedule) => (
                            <div 
                                key={schedule._id} 
                                className={`rounded-xl border transition-all duration-200 hover:shadow-md ${
                                    theme === 'dark' 
                                        ? 'bg-dark-card border-dark-border hover:border-gray-500/30' 
                                        : 'bg-white border-gray-200 hover:border-gray-500/30'
                                }`}
                            >
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        {editingName === schedule._id ? (
                                            <input
                                                type="text"
                                                defaultValue={schedule.name}
                                                onBlur={(e) => {
                                                    if (e.target.value !== schedule.name) {
                                                        handleNameEdit(schedule._id, e.target.value);
                                                    }
                                                    setEditingName(null);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleNameEdit(schedule._id, e.target.value);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingName(null);
                                                    }
                                                }}
                                                className={`text-lg font-medium p-2 rounded-lg w-full ${
                                                    theme === 'dark' 
                                                        ? 'bg-dark-darker border border-dark-border text-text-light' 
                                                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                                                } outline-none focus:ring-2 focus:ring-gray-500`}
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className={`text-lg font-semibold ${
                                                theme === 'dark' ? 'text-text-light' : 'text-gray-900'
                                            }`}>
                                                {schedule.name}
                                            </h3>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingName(schedule._id)}
                                                className={`p-2 rounded-lg ${
                                                    theme === 'dark' 
                                                        ? 'hover:bg-dark-darker text-text-muted hover:text-text-light' 
                                                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                                } transition-colors`}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(schedule._id)}
                                                className={`p-2 rounded-lg ${
                                                    theme === 'dark' 
                                                        ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300' 
                                                        : 'hover:bg-red-50 text-red-500 hover:text-red-600'
                                                } transition-colors`}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {schedule.workouts.map((workout, idx) => (
                                            <div key={idx} className={`rounded-lg p-3 ${
                                                theme === 'dark' ? 'bg-dark-darker' : 'bg-gray-50'
                                            }`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`p-1.5 rounded-md ${
                                                        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                                                    }`}>
                                                        <Calendar className={`w-4 h-4 ${
                                                            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
                                                        }`} />
                                                    </div>
                                                    <div className={`font-medium ${
                                                        theme === 'dark' ? 'text-text-light' : 'text-gray-900'
                                                    }`}>
                                                        {workout.day}
                                                    </div>
                                                </div>
                                                {workout.exercises.map((exercise, exerciseIdx) => (
                                                    <div 
                                                        key={exerciseIdx}
                                                        className="ml-6 mb-2"
                                                    >
                                                        <div className={`${
                                                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                        } font-medium`}>
                                                            • {exercise.exerciseName}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 ml-4 mt-1">
                                                            {exercise.sets.map((set, setIdx) => (
                                                                <div 
                                                                    key={setIdx} 
                                                                    className={`text-sm ${
                                                                        theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
                                                                    }`}
                                                                >
                                                                    Set {set.setNumber}: {set.reps} reps
                                                                    {set.weight > 0 && ` × ${convertWeight(set.weight)} ${weightUnit}`}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-opacity-30 border-gray-200">
                                        <span className={`text-sm ${
                                            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
                                        }`}>
                                            Created: {new Date(schedule.createdAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => setEditingSchedule(schedule)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                theme === 'dark' 
                                                    ? 'bg-dark-darker text-gray-300 hover:bg-zinc-800' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Edit Workouts
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Empty state */}
                {!loading && !error && schedules.length === 0 && (
                    <div className={`text-center p-12 rounded-xl border ${
                        theme === 'dark' 
                            ? 'bg-dark-card border-dark-border' 
                            : 'bg-white border-gray-200'
                    }`}>
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            theme === 'dark' ? 'bg-dark-darker' : 'bg-gray-100'
                        }`}>
                            <Calendar className={`w-8 h-8 ${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-text-light' : 'text-gray-900'
                        }`}>No workout schedules yet</h3>
                        <p className={`max-w-md mx-auto mb-6 ${
                            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
                        }`}>
                            Create your first workout schedule to start planning your fitness routine
                        </p>
                        <button 
                            onClick={handleAddSchedule}
                            className={`px-6 py-3 rounded-xl font-medium 
                                transition-all duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create First Schedule
                            </span>
                        </button>
                    </div>
                )}
            </div>

           {/* Edit Schedule Modal */}
{editingSchedule && (
    <EditScheduleModal
        schedule={editingSchedule}
        onClose={() => setEditingSchedule(null)}
        onSave={handleSaveEdit}
        weightUnit={weightUnit}
        convertWeight={convertWeight}
    />
)}
        </div>
    );
};

export default Workouts;