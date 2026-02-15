export const recommendationSlice = (set, get) => ({
    recommendations: {
        roles: [],
        skills: [],
        companies: [],
        savedRoles: [],
        loading: false,
        error: null,
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