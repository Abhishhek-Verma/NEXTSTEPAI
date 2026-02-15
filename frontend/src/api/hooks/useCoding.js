import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import useStore from '../../store';

export const useCoding = () => {
    const { setCodingProfile, setCodingLoading, setCodingError } = useStore();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['coding'],
        queryFn: async () => {
            setCodingLoading(true);
            const { data } = await apiClient.get('/coding/profile');
            setCodingProfile(data.profile.platforms);
            return data.profile;
        },
        onError: (error) => {
            setCodingError(error.message);
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (profile) => {
            const { data } = await apiClient.post('/coding/profile', { platforms: profile });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['coding']);
            useStore.getState().addToast({
                type: 'success',
                message: 'Coding profile saved!',
            });
        },
        onError: (error) => {
            useStore.getState().addToast({
                type: 'error',
                message: `Failed to save: ${error.message}`,
            });
        },
    });

    return {
        ...query,
        save: saveMutation.mutate,
        isSaving: saveMutation.isPending,
    };
};