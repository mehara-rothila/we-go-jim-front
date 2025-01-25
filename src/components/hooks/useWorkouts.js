
// hooks/useWorkouts.js
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../services/workoutService';

export const useWorkouts = () => {
  const queryClient = useQueryClient();
  const filters = useSelector(state => state.workouts.filters);

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['workouts', filters],
    queryFn: () => workoutService.getWorkouts(filters)
  });

  const createWorkout = useMutation({
    mutationFn: workoutService.createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
    }
  });

  return {
    workouts,
    isLoading,
    createWorkout,
    filters
  };
};