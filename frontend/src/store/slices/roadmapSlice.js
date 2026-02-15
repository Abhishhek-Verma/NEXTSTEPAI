import apiClient from '../../api/client';

export const roadmapSlice = (set, get) => ({
    roadmap: {
        id: null,
        title: '',
        targetRole: '',
        description: '',
        generatedAt: null,
        items: [],
        loading: false,
        error: null,
    },

    // Fetch roadmap from backend
    fetchRoadmap: async () => {
        try {
            set((state) => ({ roadmap: { ...state.roadmap, loading: true, error: null } }));
            const response = await apiClient.get('/roadmap');
            set((state) => ({
                roadmap: {
                    ...state.roadmap,
                    ...response.data.roadmap,
                    loading: false,
                },
            }));
        } catch (error) {
            console.error('Failed to fetch roadmap:', error);
            set((state) => ({
                roadmap: {
                    ...state.roadmap,
                    loading: false,
                    error: error.message || 'Failed to fetch roadmap',
                },
            }));
        }
    },

    // Generate new roadmap via AI
    generateRoadmap: async (targetRole) => {
        try {
            set((state) => ({ roadmap: { ...state.roadmap, loading: true, error: null } }));
            const response = await apiClient.post('/roadmap/generate', { targetRole });
            set((state) => ({
                roadmap: {
                    ...state.roadmap,
                    ...response.data.roadmap,
                    loading: false,
                },
            }));
            return response.data.roadmap;
        } catch (error) {
            console.error('Failed to generate roadmap:', error);
            set((state) => ({
                roadmap: {
                    ...state.roadmap,
                    loading: false,
                    error: error.message || 'Failed to generate roadmap',
                },
            }));
            throw error;
        }
    },

    setRoadmap: (roadmap) =>
        set((state) => ({
            roadmap: { ...state.roadmap, ...roadmap, loading: false, error: null },
        })),

    addRoadmapItem: (item) =>
        set((state) => ({
            roadmap: {
                ...state.roadmap,
                items: [...state.roadmap.items, { ...item, id: Date.now() }],
            },
        })),

    // Update roadmap item (with API call)
    updateRoadmapItem: async (id, updates) => {
        try {
            // Update locally first for responsiveness
            set((state) => ({
                roadmap: {
                    ...state.roadmap,
                    items: state.roadmap.items.map((item) =>
                        item.id === id ? { ...item, ...updates } : item
                    ),
                },
            }));

            // Then sync to backend
            await apiClient.put(`/roadmap/items/${id}`, updates);
        } catch (error) {
            console.error('Failed to update roadmap item:', error);
            // Optionally revert the change or show error
        }
    },

    deleteRoadmapItem: (id) =>
        set((state) => ({
            roadmap: {
                ...state.roadmap,
                items: state.roadmap.items.filter((item) => item.id !== id),
            },
        })),

    reorderRoadmapItems: (items) =>
        set((state) => ({
            roadmap: { ...state.roadmap, items },
        })),

    // Toggle item complete (with API call)
    toggleItemComplete: async (id) => {
        try {
            const state = get();
            const item = state.roadmap.items.find((i) => i.id === id);
            if (!item) return;

            const newCompleted = !item.completed;

            // Update locally first
            set((state) => ({
                roadmap: {
                    ...state.roadmap,
                    items: state.roadmap.items.map((item) =>
                        item.id === id ? { ...item, completed: newCompleted } : item
                    ),
                },
            }));

            // Sync to backend
            await apiClient.put(`/roadmap/items/${id}`, { completed: newCompleted });
        } catch (error) {
            console.error('Failed to toggle item completion:', error);
        }
    },

    exportRoadmapJSON: () => {
        const roadmap = get().roadmap;
        const dataStr = JSON.stringify(roadmap, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `roadmap-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    exportRoadmapCSV: () => {
        const items = get().roadmap.items;
        const headers = ['Task Type', 'Description', 'Due Date', 'Completed'];
        const rows = items.map((item) => [
            item.taskType,
            item.description,
            item.dueDate || 'No date',
            item.completed ? 'Yes' : 'No',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `roadmap-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    },

    setRoadmapLoading: (loading) =>
        set((state) => ({
            roadmap: { ...state.roadmap, loading },
        })),

    setRoadmapError: (error) =>
        set((state) => ({
            roadmap: { ...state.roadmap, error, loading: false },
        })),
});