import { QueryClient } from "@tanstack/react-query";

class QueryClientSingleton {
    private static instance: QueryClient | null = null;

    private constructor() {}

    public static getInstance(): QueryClient {
        if (!QueryClientSingleton.instance) {
            QueryClientSingleton.instance = new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        gcTime: 1000 * 60 * 60, // 1 hour
                        retry: 1,
                        refetchOnWindowFocus: true,
                    },
                    mutations: {
                        retry: 1,
                    },
                },
            });
        }

        return QueryClientSingleton.instance;
    }

    public static clearInstance(): void {
        QueryClientSingleton.instance = null;
    }
}

export const queryClient = QueryClientSingleton.getInstance();

// Utility function to reset the query client (useful for testing or logging out)
export const resetQueryClient = () => {
    queryClient.clear();
    QueryClientSingleton.clearInstance();
};
