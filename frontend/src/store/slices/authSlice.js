export const authSlice = (set, get) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    clearUser: () => set({ user: null, isAuthenticated: false }),
});