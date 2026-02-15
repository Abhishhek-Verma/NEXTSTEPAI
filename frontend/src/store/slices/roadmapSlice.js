export const roadmapSlice = (set, get) => ({
    roadmap: {
        id: null,
        title: '',
        generatedAt: null,
        items: [],
        loading: false,
        error: null,
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

    updateRoadmapItem: (id, updates) =>
        set((state) => ({
            roadmap: {
                ...state.roadmap,
                items: state.roadmap.items.map((item) =>
                    item.id === id ? { ...item, ...updates } : item
                ),
            },
        })),

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

    toggleItemComplete: (id) =>
        set((state) => ({
            roadmap: {
                ...state.roadmap,
                items: state.roadmap.items.map((item) =>
                    item.id === id ? { ...item, completed: !item.completed } : item
                ),
            },
        })),

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