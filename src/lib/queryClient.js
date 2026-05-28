import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Prevents unnecessary background network requests
            retry: 1,                    // Retries failed requests once before showing an error
        },
    },
});
