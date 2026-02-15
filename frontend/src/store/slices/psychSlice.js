export const psychSlice = (set, get) => ({
    psychometric: {
        testName: 'Career Traits Assessment',
        takenAt: null,
        traits: {},
        score: 0,
        progress: 0,
        loading: false,
        error: null,
    },

    setPsychometric: (data) =>
        set((state) => ({
            psychometric: {
                ...state.psychometric,
                ...data,
                loading: false,
                error: null,
            },
        })),

    setPsychometricResults: (results) =>
        set((state) => ({
            psychometric: {
                ...state.psychometric,
                ...results,
                loading: false,
                error: null,
            },
        })),

    updateTestProgress: (progress) =>
        set((state) => ({
            psychometric: { ...state.psychometric, progress },
        })),

    updateTraits: (traits) =>
        set((state) => ({
            psychometric: {
                ...state.psychometric,
                traits: { ...state.psychometric.traits, ...traits },
            },
        })),

    setPsychLoading: (loading) =>
        set((state) => ({
            psychometric: { ...state.psychometric, loading },
        })),

    setPsychError: (error) =>
        set((state) => ({
            psychometric: { ...state.psychometric, error, loading: false },
        })),
});