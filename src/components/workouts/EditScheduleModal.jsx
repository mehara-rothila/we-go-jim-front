// src/components/workouts/EditScheduleModal.jsx
import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const EditScheduleModal = ({ schedule, onClose, onSave }) => {
    const { isDark } = useTheme();
    const [editedSchedule, setEditedSchedule] = useState(schedule);

    const addNewExercise = (workoutIndex) => {
        const newSchedule = {...editedSchedule};
        newSchedule.workouts[workoutIndex].exercises.push({
            exerciseName: "New Exercise",
            sets: [
                {
                    setNumber: 1,
                    reps: 12
                }
            ]
        });
        setEditedSchedule(newSchedule);
    };

    const updateExerciseName = (workoutIndex, exerciseIndex, newName) => {
        const newSchedule = {...editedSchedule};
        newSchedule.workouts[workoutIndex].exercises[exerciseIndex].exerciseName = newName;
        setEditedSchedule(newSchedule);
    };

    const removeExercise = (workoutIndex, exerciseIndex) => {
        const newSchedule = {...editedSchedule};
        newSchedule.workouts[workoutIndex].exercises.splice(exerciseIndex, 1);
        setEditedSchedule(newSchedule);
    };

    const updateReps = (workoutIndex, exerciseIndex, setIndex, reps) => {
        const newSchedule = {...editedSchedule};
        newSchedule.workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex].reps = Number(reps);
        setEditedSchedule(newSchedule);
    };

    const addSet = (workoutIndex, exerciseIndex) => {
        const newSchedule = {...editedSchedule};
        const currentSets = newSchedule.workouts[workoutIndex].exercises[exerciseIndex].sets;
        currentSets.push({
            setNumber: currentSets.length + 1,
            reps: 12
        });
        setEditedSchedule(newSchedule);
    };

    const removeSet = (workoutIndex, exerciseIndex, setIndex) => {
        const newSchedule = {...editedSchedule};
        newSchedule.workouts[workoutIndex].exercises[exerciseIndex].sets.splice(setIndex, 1);
        // Renumber sets
        newSchedule.workouts[workoutIndex].exercises[exerciseIndex].sets.forEach((set, idx) => {
            set.setNumber = idx + 1;
        });
        setEditedSchedule(newSchedule);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className={`relative w-full max-w-2xl rounded-xl p-6 ${isDark ? 'bg-[#1e293b]' : 'bg-white'}`}>
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-6">Edit Schedule</h2>

                {editedSchedule.workouts.map((workout, workoutIndex) => (
                    <div key={workoutIndex} className="mb-6">
                        <h3 className="text-lg font-medium mb-4">{workout.day}</h3>

                        <div className="space-y-4">
                            {workout.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <input
                                            type="text"
                                            value={exercise.exerciseName}
                                            onChange={(e) => updateExerciseName(workoutIndex, exerciseIndex, e.target.value)}
                                            className="text-lg font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                                        />
                                        <button
                                            onClick={() => removeExercise(workoutIndex, exerciseIndex)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>

                                    {exercise.sets.map((set, setIndex) => (
                                        <div key={setIndex} className="flex items-center gap-4 mb-2">
                                            <span className="text-sm text-gray-500">Set {set.setNumber}</span>
                                            <input
                                                type="number"
                                                value={set.reps}
                                                onChange={(e) => updateReps(workoutIndex, exerciseIndex, setIndex, e.target.value)}
                                                className="w-20 px-2 py-1 border rounded"
                                            />
                                            <span className="text-sm text-gray-500">reps</span>
                                            <button
                                                onClick={() => removeSet(workoutIndex, exerciseIndex, setIndex)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => addSet(workoutIndex, exerciseIndex)}
                                        className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 mt-2"
                                    >
                                        <Plus size={16} /> Add Set
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => addNewExercise(workoutIndex)}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add New Exercise
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(editedSchedule)}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditScheduleModal;