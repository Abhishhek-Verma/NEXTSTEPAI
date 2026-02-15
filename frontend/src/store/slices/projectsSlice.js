export const projectsSlice = (set, get) => ({
    projects: {
        list: [],
        loading: false,
        error: null,
    },

    setProjects: (projects) =>
        set((state) => ({
            projects: { ...state.projects, list: projects, loading: false, error: null },
        })),

    addProject: (project) =>
        set((state) => ({
            projects: {
                ...state.projects,
                list: [...state.projects.list, { ...project, id: Date.now() }],
            },
        })),

    updateProject: (id, updates) =>
        set((state) => ({
            projects: {
                ...state.projects,
                list: state.projects.list.map((p) =>
                    p.id === id ? { ...p, ...updates } : p
                ),
            },
        })),

    deleteProject: (id) =>
        set((state) => ({
            projects: {
                ...state.projects,
                list: state.projects.list.filter((p) => p.id !== id),
            },
        })),

    setProjectsLoading: (loading) =>
        set((state) => ({
            projects: { ...state.projects, loading },
        })),

    setProjectsError: (error) =>
        set((state) => ({
            projects: { ...state.projects, error, loading: false },
        })),
});