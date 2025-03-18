// src/hooks/useSchedules.js
import { useState, useEffect } from 'react';
import { getSchedules, createSchedule as apiCreateSchedule } from '../services/api';

export const useSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getSchedules();
            setSchedules(response.data);
        } catch (err) {
            setError('Failed to fetch schedules. Please try again.');
            console.error('Error fetching schedules:', err);
        } finally {
            setLoading(false);
        }
    };

    const addSchedule = async (scheduleData) => {
        try {
            setError(null);
            const response = await apiCreateSchedule(scheduleData);
            await fetchSchedules();
            return response.data;
        } catch (err) {
            setError('Failed to add schedule. Please try again.');
            console.error('Error adding schedule:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    return { schedules, loading, error, fetchSchedules, addSchedule };
};