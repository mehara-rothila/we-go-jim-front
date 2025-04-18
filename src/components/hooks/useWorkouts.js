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
            setSchedules(response.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch schedules');
            console.error('Error fetching schedules:', err);
        } finally {
            setLoading(false);
        }
    };

    const addSchedule = async (scheduleData) => {
        try {
            const response = await api.post('/schedules', scheduleData);
            await fetchSchedules();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add schedule');
            console.error('Error adding schedule:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    return { schedules, loading, error, fetchSchedules, addSchedule };
};