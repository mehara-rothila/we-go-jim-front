// src/hooks/useSchedules.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await api.get('/schedules');
            setSchedules(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch schedules');
        } finally {
            setLoading(false);
        }
    };

    const addSchedule = async (scheduleData) => {
        try {
            const response = await api.post('/schedules', scheduleData);
            setSchedules(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to add schedule');
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    return {
        schedules,
        loading,
        error,
        fetchSchedules,
        addSchedule
    };
};