export const codingSlice = (set, get) => ({
    coding: {
        platforms: {
            github: { profileUrl: '', username: '', metrics: {} },
            leetcode: { profileUrl: '', username: '', metrics: {} },
            codeforces: { profileUrl: '', handle: '', metrics: {} },
            codechef: { profileUrl: '', handle: '', metrics: {} },
        },
        loading: false,
        error: null,
    },

    setCodingProfile: (profile) =>
        set((state) => ({
            coding: { ...state.coding, platforms: profile, loading: false, error: null },
        })),

    updatePlatform: (platform, data) =>
        set((state) => ({
            coding: {
                ...state.coding,
                platforms: {
                    ...state.coding.platforms,
                    [platform]: { ...state.coding.platforms[platform], ...data },
                },
            },
        })),

    setCodingLoading: (loading) =>
        set((state) => ({
            coding: { ...state.coding, loading },
        })),

    setCodingError: (error) =>
        set((state) => ({
            coding: { ...state.coding, error, loading: false },
        })),
});