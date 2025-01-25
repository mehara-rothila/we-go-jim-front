// src/pages/Workouts.jsx
import React, { useState } from 'react';
import { Search, Filter, Plus, Loader, Trash, Edit2, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSchedules } from '../hooks/useSchedules';
import EditScheduleModal from '../components/workouts/EditScheduleModal';
import api from '../services/api';

const Workouts = () => {
    const { isDark } = useTheme();
    const { schedules, loading, error, fetchSchedules, addSchedule } = useSchedules();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [editingName, setEditingName] = useState(null);

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
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    return (
        <div className={`p-6 min-h-screen ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                            Your Workout Schedules
                        </h1>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            Create and manage your workout routines
                        </p>
                    </div>
                    <button 
                        onClick={handleAddSchedule}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                            isDark 
                                ? 'bg-white text-[#0f172a] hover:bg-gray-100' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        New Schedule
                    </button>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search schedules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                                isDark 
                                    ? 'bg-[#1e293b] text-white placeholder-gray-400' 
                                    : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-200'
                            }`}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schedules
                        .filter(schedule => 
                            schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((schedule) => (
                            <div 
                                key={schedule._id} 
                                className={`rounded-xl p-4 ${
                                    isDark ? 'bg-[#1e293b]' : 'bg-white border border-gray-200'
                                }`}
                            >
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
                                            className={`text-lg font-medium p-1 rounded w-full ${
                                                isDark ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-900'
                                            } outline-none focus:ring-2 focus:ring-blue-500`}
                                            autoFocus
                                        />
                                    ) : (
                                        <h3 className={`text-lg font-medium ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {schedule.name}
                                        </h3>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingName(schedule._id)}
                                            className={`p-2 rounded-lg ${
                                                isDark ? 'hover:bg-[#0f172a]' : 'hover:bg-gray-100'
                                            } transition-colors`}
                                        >
                                            <Edit2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(schedule._id)}
                                            className={`p-2 rounded-lg ${
                                                isDark ? 'hover:bg-[#0f172a]' : 'hover:bg-gray-100'
                                            } transition-colors`}
                                        >
                                            <Trash className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {schedule.workouts.map((workout, idx) => (
                                        <div key={idx}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className={`w-4 h-4 ${
                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                }`} />
                                                <div className={`font-medium ${
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {workout.day}
                                                </div>
                                            </div>
                                            {workout.exercises.map((exercise, exerciseIdx) => (
                                                <div 
                                                    key={exerciseIdx}
                                                    className="ml-6 mb-2"
                                                >
                                                    <div className="text-blue-500">
                                                        • {exercise.exerciseName}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 ml-4">
                                                        {exercise.sets.map((set, setIdx) => (
                                                            <div 
                                                                key={setIdx} 
                                                                className={isDark ? 'text-gray-400' : 'text-gray-500'}
                                                            >
                                                                Set {set.setNumber}: {set.reps} reps
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className={`text-sm ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Created: {new Date(schedule.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => setEditingSchedule(schedule)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {editingSchedule && (
                <EditScheduleModal
                    schedule={editingSchedule}
                    onClose={() => setEditingSchedule(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default Workouts;