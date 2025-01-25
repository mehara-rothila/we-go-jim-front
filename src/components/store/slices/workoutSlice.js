// store/slices/workoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const workoutSlice = createSlice({
  name: 'workouts',
  initialState: {
    workouts: [],
    currentWorkout: null,
    isLoading: false,
    error: null,
    filters: {
      dateRange: 'week',
      type: 'all',
      sort: 'date'
    }
  },
  reducers: {
    setWorkouts: (state, action) => {
      state.workouts = action.payload;
    },
    addWorkout: (state, action) => {
      state.workouts.push(action.payload);
    },
    updateWorkout: (state, action) => {
      const index = state.workouts.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workouts[index] = action.payload;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  }
});
