// src/components/workouts/EditScheduleModal.jsx
import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const EditScheduleModal = ({ schedule, onClose, onSave, weightUnit = 'kg', convertWeight }) => {
    const { isDark } = useTheme();
    const [editedSchedule, setEditedSchedule] = useState(JSON.parse(JSON.stringify(schedule)));

    // Convert display weight to storage weight (kg)
    const convertToStorageUnit = (displayWeight) => {
        if (weightUnit === 'lbs') {
            // Convert lbs back to kg (1 lbs ≈ 0.453592 kg)
            return (displayWeight * 0.453592).toFixed(1);
        }
        return displayWeight;
    };

    // If no convertWeight function is provided, create a default one
    const displayWeight = convertWeight || ((weight) => {
        if (weightUnit === 'lbs') {
            // Convert kg to lbs (1 kg ≈ 2.20462 lbs)
            return (weight * 2.20462).toFixed(1);
        }
        return weight;
    });

    const handleSave = () => {
        onSave(editedSchedule);
    };

    const addExercise = (workoutIndex) => {
        const workouts = [...editedSchedule.workouts];
        workouts[workoutIndex].exercises.push({
            exerciseName: 'New Exercise',
            sets: [{ setNumber: 1, reps: 10, weight: 0 }]
        });
        setEditedSchedule({ ...editedSchedule, workouts });
    };

    const addSet = (workoutIndex, exerciseIndex) => {
        const workouts = [...editedSchedule.workouts];
        const sets = workouts[workoutIndex].exercises[exerciseIndex].sets;
        sets.push({
            setNumber: sets.length + 1,
            reps: 10,
            weight: 0
        });
        setEditedSchedule({ ...editedSchedule, workouts });
    };

    const removeExercise = (workoutIndex, exerciseIndex) => {
        const workouts = [...editedSchedule.workouts];
        workouts[workoutIndex].exercises.splice(exerciseIndex, 1);
        setEditedSchedule({ ...editedSchedule, workouts });
    };

    const removeSet = (workoutIndex, exerciseIndex, setIndex) => {
        const workouts = [...editedSchedule.workouts];
        workouts[workoutIndex].exercises[exerciseIndex].sets.splice(setIndex, 1);
        // Update set numbers
        workouts[workoutIndex].exercises[exerciseIndex].sets.forEach((set, idx) => {
            set.setNumber = idx + 1;
        });
        setEditedSchedule({ ...editedSchedule, workouts });
    };

    const updateExerciseName = (workoutIndex, exerciseIndex, name) => {
        const workouts = [...editedSchedule.workouts];
        workouts[workoutIndex].exercises[exerciseIndex].exerciseName = name;
        setEditedSchedule({ ...editedSchedule, workouts });
    };

    const updateSetDetails = (workoutIndex, exerciseIndex, setIndex, field, value) => {
        const workouts = [...editedSchedule.workouts];
        
        // Handle weight conversions if needed
        if (field === 'weight' && weightUnit === 'lbs') {
            // Convert from display value (lbs) to storage value (kg)
            workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex][field] = 
                value ? parseFloat(convertToStorageUnit(value)) : 0;
        } else {
            workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex][field] = field === 'setNumber' 
                ? parseInt(value) 
                : parseInt(value) || 0;
        }
        
        setEditedSchedule({ ...editedSchedule, workouts });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6 ${
                isDark ? 'bg-[#1e293b]' : 'bg-white'
            }`}>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Edit Schedule: {schedule.name}
                </h2>

                {editedSchedule.workouts.map((workout, workoutIndex) => (
                    <div key={workoutIndex} className="mb-8">
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {workout.day}
                        </h3>

                        {workout.exercises.map((exercise, exerciseIndex) => (
                            <div 
                                key={exerciseIndex} 
                                className={`mb-6 p-4 rounded-lg ${
                                    isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <input
                                        type="text"
                                        value={exercise.exerciseName}
                                        onChange={(e) => updateExerciseName(workoutIndex, exerciseIndex, e.target.value)}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                                            isDark 
                                                ? 'bg-[#1e293b] text-white border-[#2a334a]' 
                                                : 'bg-white text-gray-900 border-gray-200'
                                        } border`}
                                    />
                                    <button
                                        onClick={() => removeExercise(workoutIndex, exerciseIndex)}
                                        className="ml-2 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mb-2 grid grid-cols-12 gap-2">
                                    <div className={`col-span-3 text-sm font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Set</div>
                                    <div className={`col-span-4 text-sm font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Reps</div>
                                    <div className={`col-span-4 text-sm font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Weight ({weightUnit})</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {exercise.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="grid grid-cols-12 gap-2 mb-2">
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={set.setNumber}
                                                onChange={(e) => updateSetDetails(workoutIndex, exerciseIndex, setIndex, 'setNumber', e.target.value)}
                                                className={`w-full px-3 py-2 rounded-lg text-sm ${
                                                    isDark 
                                                        ? 'bg-[#1e293b] text-white border-[#2a334a]' 
                                                        : 'bg-white text-gray-900 border-gray-200'
                                                } border`}
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={set.reps}
                                                onChange={(e) => updateSetDetails(workoutIndex, exerciseIndex, setIndex, 'reps', e.target.value)}
                                                className={`w-full px-3 py-2 rounded-lg text-sm ${
                                                    isDark 
                                                        ? 'bg-[#1e293b] text-white border-[#2a334a]' 
                                                        : 'bg-white text-gray-900 border-gray-200'
                                                } border`}
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <input
                                                type="number"
                                                min="0"
                                                // Display weight in user's preferred unit
                                                value={weightUnit === 'lbs' ? displayWeight(set.weight || 0) : (set.weight || 0)}
                                                onChange={(e) => updateSetDetails(workoutIndex, exerciseIndex, setIndex, 'weight', e.target.value)}
                                                className={`w-full px-3 py-2 rounded-lg text-sm ${
                                                    isDark 
                                                        ? 'bg-[#1e293b] text-white border-[#2a334a]' 
                                                        : 'bg-white text-gray-900 border-gray-200'
                                                } border`}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <button
                                                onClick={() => removeSet(workoutIndex, exerciseIndex, setIndex)}
                                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => addSet(workoutIndex, exerciseIndex)}
                                    className={`mt-2 flex items-center text-sm px-3 py-2 rounded-lg ${
                                        isDark 
                                            ? 'bg-[#1e293b] text-blue-400 hover:bg-[#2a334a]' 
                                            : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Set
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => addExercise(workoutIndex)}
                            className={`flex items-center text-sm px-4 py-2 rounded-lg ${
                                isDark 
                                    ? 'bg-[#1e293b] text-blue-400 hover:bg-[#2a334a]' 
                                    : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                            }`}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exercise
                        </button>
                    </div>
                ))}

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            isDark 
                                ? 'bg-[#1e293b] text-white hover:bg-[#2a334a]' 
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditScheduleModal;