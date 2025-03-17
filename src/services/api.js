// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

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
export const getYearlyProgress = () => api.get('/stats/yearly-progress');
export const getPerformanceMetrics = () => api.get('/stats/performance-metrics');

export default api;