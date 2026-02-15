export const uiSlice = (set, get) => ({
    theme: 'light',
    toasts: [],
    dialogs: {
        confirmDelete: { open: false, itemId: null, onConfirm: null },
    },

    setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    },

    toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
    },

    addToast: (toast) => {
        const id = Date.now();
        const newToast = { id, ...toast, visible: true };
        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        // Auto-remove after 5 seconds
        setTimeout(() => {
            get().removeToast(id);
        }, toast.duration || 5000);
    },

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),

    openDialog: (dialogName, data) =>
        set((state) => ({
            dialogs: {
                ...state.dialogs,
                [dialogName]: { open: true, ...data },
            },
        })),

    closeDialog: (dialogName) =>
        set((state) => ({
            dialogs: {
                ...state.dialogs,
                [dialogName]: { open: false },
            },
        })),

    // Dev-only: Reset all app data
    resetAppData: () => {
        localStorage.removeItem('nextstepai-v3');
        window.location.reload();
    },
});