import { useQuery } from "@tanstack/react-query";
import { reportApi, ReportFilters } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

// Define the report data type
export interface TopSellingDesign {
    designId: string;
    title: string;
    designer: string;
    designerId: string;
    quantity: number;
    revenue: number;
}

export interface SalesByDate {
    date: string;
    orders: number;
    revenue: number;
}

export interface SalesByDesigner {
    designerId: string;
    designerName: string;
    orders: number;
    revenue: number;
}

export interface SalesByCategory {
    category: string;
    sales: number;
    revenue: number;
}

export interface ReportDataType {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingDesigns: TopSellingDesign[];
    salesByDate: SalesByDate[];
    salesByDesigner: SalesByDesigner[];
    salesByCategory?: SalesByCategory[]; // Optional for backward compatibility
}

// Create a query key factory for sales reports
export const salesReportKeys = {
    all: ["salesReport"] as const,
    filters: (filters: ReportFilters) =>
        [...salesReportKeys.all, filters] as const,
};

// Custom hook for fetching and caching sales report data
export function useSalesReport(filters: ReportFilters) {
    const { toast } = useToast();

    return useQuery({
        queryKey: salesReportKeys.filters(filters),
        queryFn: async () => {
            try {
                const response = await reportApi.getSalesReport(filters);
                return response.data as ReportDataType;
            } catch (error) {
                // Handle errors
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to load report data";

                // Only show toast for network errors, not for offline mode
                if (navigator.onLine) {
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
                    });
                }

                throw error;
            }
        },
        // Enable stale data to be shown when offline
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        // Retry failed requests
        retry: 2,
        // Don't refetch on window focus if offline
        refetchOnWindowFocus: navigator.onLine,
        // Handle offline mode
        networkMode: "online",
        // Return last successful data when offline
        placeholderData: (keepPreviousData) => keepPreviousData,
    });
}

// Custom hook for checking online status
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
}

// Missing import
import { useState, useEffect } from "react";
