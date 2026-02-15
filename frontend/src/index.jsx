import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
    throw new Error('Missing Clerk Publishable Key');
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Start MSW in development
async function enableMocking() {
    const useMocks = import.meta.env.VITE_USE_MOCKS;

    if (useMocks !== 'true') {
        return;
    }

    try {
        const { worker } = await import('./mocks/browser');

        await worker.start({
            onUnhandledRequest: 'bypass',
            serviceWorker: {
                url: '/mockServiceWorker.js',
            },
        });
    } catch (error) {
        console.error('[MSW] Failed to start:', error);
    }
}

enableMocking().then(() => {

    createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <ClerkProvider publishableKey={clerkPubKey}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </ClerkProvider>
        </React.StrictMode>
    );
});
