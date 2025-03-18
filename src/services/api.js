// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add interceptor to include auth token in all requests
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/me');

// Schedule endpoints
export const getSchedules = () => api.get('/schedules');
export const createSchedule = (scheduleData) => api.post('/schedules', scheduleData);
export const updateSchedule = (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

// Stats endpoints
export const getWeeklySummary = () => api.get('/stats/weekly-summary');
export const getMonthlySummary = () => api.get('/stats/monthly-summary');
export const getPerformanceMetrics = () => api.get('/stats/performance-metrics');

// Exercise endpoints
export const getExercises = () => api.get('/exercises');
export const getExercise = (id) => api.get(`/exercises/${id}`);
export const createExercise = (exerciseData) => api.post('/exercises', exerciseData);
export const updateExercise = (id, exerciseData) => api.put(`/exercises/${id}`, exerciseData);
export const deleteExercise = (id) => api.delete(`/exercises/${id}`);

export default api;