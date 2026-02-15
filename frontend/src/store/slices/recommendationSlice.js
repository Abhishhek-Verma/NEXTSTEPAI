import apiClient from '../../api/client';

export const recommendationSlice = (set, get) => ({
    recommendations: {
        roles: [],
        skills: [],
        companies: [],
        savedRoles: [],
        generatedAt: null,
        loading: false,
        error: null,
    },

    // Fetch recommendations from backend
    fetchRecommendations: async () => {
        try {
            set((state) => ({ recommendations: { ...state.recommendations, loading: true, error: null } }));
            const response = await apiClient.get('/recommendations');
            set((state) => ({
                recommendations: {
                    ...state.recommendations,
                    ...response.data.recommendations,
                    loading: false,
                },
            }));
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            set((state) => ({
                recommendations: {
                    ...state.recommendations,
                    loading: false,
                    error: error.message || 'Failed to fetch recommendations',
                },
            }));
        }
    },

    // Generate new recommendations via AI
    generateRecommendations: async () => {
        try {
            set((state) => ({ recommendations: { ...state.recommendations, loading: true, error: null } }));
            const response = await apiClient.post('/recommendations/generate');
            set((state) => ({
                recommendations: {
                    ...state.recommendations,
                    roles: response.data.recommendations.roles || [],
                    skills: response.data.recommendations.skills || [],
                    companies: response.data.recommendations.companies || [],
                    generatedAt: new Date().toISOString(),
                    loading: false,
                },
            }));
            return response.data.recommendations;
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
            set((state) => ({
                recommendations: {
                    ...state.recommendations,
                    loading: false,
                    error: error.message || 'Failed to generate recommendations',
                },
            }));
            throw error;
        }
    },

    setRecommendations: (data) =>
        set((state) => ({
            recommendations: {
                ...state.recommendations,
                ...data,
                loading: false,
                error: null,
            },
        })),

    saveRole: (roleId) =>
        set((state) => ({
            recommendations: {
                ...state.recommendations,
                savedRoles: [...state.recommendations.savedRoles, roleId],
            },
        })),

    unsaveRole: (roleId) =>
        set((state) => ({
            recommendations: {
                ...state.recommendations,
                savedRoles: state.recommendations.savedRoles.filter((id) => id !== roleId),
            },
        })),

    setRecommendationsLoading: (loading) =>
        set((state) => ({
            recommendations: { ...state.recommendations, loading },
        })),

    setRecommendationsError: (error) =>
        set((state) => ({
            recommendations: { ...state.recommendations, error, loading: false },
        })),
});