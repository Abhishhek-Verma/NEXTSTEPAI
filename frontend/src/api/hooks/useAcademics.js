import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import useStore from '../../store';

export const useAcademics = () => {
    const { setAcademicRecords, setAcademicsLoading, setAcademicsError } = useStore();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['academics'],
        queryFn: async () => {
            setAcademicsLoading(true);
            const { data } = await apiClient.get('/academic/records');
            setAcademicRecords(data.records);
            return data.records;
        },
        onError: (error) => {
            setAcademicsError(error.message);
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (records) => {
            const { data } = await apiClient.post('/academic/records', { records });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['academics']);
            useStore.getState().addToast({
                type: 'success',
                message: 'Academic records saved successfully!',
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