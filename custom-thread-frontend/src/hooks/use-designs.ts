import { useQuery } from "@tanstack/react-query";
import { designApi } from "@/services/api";

// For regular design listing
export function useDesigns(params = {}) {
    return useQuery({
        queryKey: ["designs", params],
        queryFn: () => designApi.getDesigns(params),
    });
}

// For getting a specific design by ID
export function useDesign(id: string) {
    return useQuery({
        queryKey: ["design", id],
        queryFn: () => designApi.getDesignById(id),
        enabled: !!id, // Only run the query if id is provided
    });
}

// For searching designs
export function useSearchDesigns(query: string, params = {}) {
    return useQuery({
        queryKey: ["designs", "search", query, params],
        queryFn: () => designApi.searchDesigns(query, params),
        enabled: !!query, // Only run the query if query is provided
    });
}
