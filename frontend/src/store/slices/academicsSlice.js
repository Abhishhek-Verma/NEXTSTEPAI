export const academicsSlice = (set, get) => ({
    academics: {
        records: [],
        loading: false,
        error: null,
    },

    setAcademicRecords: (records) =>
        set((state) => ({
            academics: { ...state.academics, records, loading: false, error: null },
        })),

    addAcademicRecord: (record) =>
        set((state) => ({
            academics: {
                ...state.academics,
                records: [...state.academics.records, record],
            },
        })),

    updateAcademicRecord: (id, updates) =>
        set((state) => ({
            academics: {
                ...state.academics,
                records: state.academics.records.map((r) =>
                    r.id === id ? { ...r, ...updates } : r
                ),
            },
        })),

    deleteAcademicRecord: (id) =>
        set((state) => ({
            academics: {
                ...state.academics,
                records: state.academics.records.filter((r) => r.id !== id),
            },
        })),

    setAcademicsLoading: (loading) =>
        set((state) => ({
            academics: { ...state.academics, loading },
        })),

    setAcademicsError: (error) =>
        set((state) => ({
            academics: { ...state.academics, error, loading: false },
        })),

    // Selectors
    getGPAAverage: () => {
        const records = get().academics.records;
        if (records.length === 0) return '0.00';
        const sum = records.reduce((acc, r) => {
            const gpaValue = parseFloat(r.gpa);
            return acc + (isNaN(gpaValue) ? 0 : gpaValue);
        }, 0);
        return (sum / records.length).toFixed(2);
    },

    getGPATrend: () => {
        const records = get().academics.records;
        return records
            .sort((a, b) => (a.semester || 0) - (b.semester || 0))
            .map((r) => ({ 
                semester: r.semester || 0, 
                gpa: parseFloat(r.gpa) || 0 
            }));
    },
});