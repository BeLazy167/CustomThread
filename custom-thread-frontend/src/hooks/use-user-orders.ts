import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../services/api";

// Helper to attempt refreshing the Clerk session

export interface OrderItem {
    design: {
        _id: string;
        title: string;
        price: number;
        images: string[];
    };
    quantity: number;
    size: string;
    color: string;
    _id: string;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    shippingDetails: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "refunded";
    paymentIntent?: string;
    createdAt: string;
    updatedAt: string;
}

interface OrdersResponse {
    orders: Order[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Define query keys as constants for better consistency
const ORDERS_QUERY_KEY = "orders";
const USER_ORDERS_QUERY_KEY = "user-orders";

export function useUserOrders(initialPage = 1, initialLimit = 10) {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const queryClient = useQueryClient();

    // Query key creator function
    const createQueryKey = (page: number, limit: number) => [
        ORDERS_QUERY_KEY,
        USER_ORDERS_QUERY_KEY,
        { page, limit },
    ];

    // Fetch orders function
    const fetchOrders = async ({
        page = initialPage,
        limit = initialLimit,
    }) => {
        if (!isSignedIn || !user) return null;

        try {
            const response = await orderApi.getUserOrders(page, limit);
            return response as OrdersResponse;
        } catch (error) {
            console.error("Error fetching user orders:", error);
            throw error;
        }
    };

    // Main query for orders with pagination
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: createQueryKey(initialPage, initialLimit),
        queryFn: () => fetchOrders({ page: initialPage, limit: initialLimit }),
        enabled: !!isSignedIn && !!user,
        retry: (failureCount, error) => {
            // Don't retry on authorization errors
            if (
                error instanceof Error &&
                (error.message.includes("401") ||
                    error.message.includes("Unauthorized"))
            ) {
                return false;
            }
            // Retry other errors up to 3 times
            return failureCount < 3;
        },
        // Note: using the project's default staleTime from query client
    });

    // Cancel order mutation
    const cancelOrderMutation = useMutation({
        mutationFn: async (orderId: string) => {
            if (!isSignedIn || !user) return null;

            try {
                const response = await orderApi.cancelOrder(orderId);
                return response;
            } catch (error) {
                console.error("Error cancelling order:", error);
                throw error;
            }
        },
        onSuccess: () => {
            // Invalidate all user orders queries
            queryClient.invalidateQueries({
                queryKey: [ORDERS_QUERY_KEY, USER_ORDERS_QUERY_KEY],
            });
        },
    });

    // Pagination functions
    const fetchNextPage = async () => {
        if (data && data.pagination.page < data.pagination.totalPages) {
            const nextPage = data.pagination.page + 1;

            try {
                const newData = await fetchOrders({
                    page: nextPage,
                    limit: initialLimit,
                });

                if (newData) {
                    queryClient.setQueryData(
                        createQueryKey(initialPage, initialLimit),
                        {
                            ...newData,
                            pagination: {
                                ...newData.pagination,
                                page: nextPage,
                            },
                        }
                    );
                }
            } catch (error) {
                console.error("Error fetching next page:", error);
            }
        }
    };

    const fetchPreviousPage = async () => {
        if (data && data.pagination.page > 1) {
            const prevPage = data.pagination.page - 1;

            try {
                const newData = await fetchOrders({
                    page: prevPage,
                    limit: initialLimit,
                });

                if (newData) {
                    queryClient.setQueryData(
                        createQueryKey(initialPage, initialLimit),
                        {
                            ...newData,
                            pagination: {
                                ...newData.pagination,
                                page: prevPage,
                            },
                        }
                    );
                }
            } catch (error) {
                console.error("Error fetching previous page:", error);
            }
        }
    };

    return {
        orders: data?.orders || [],
        pagination: data?.pagination || {
            page: initialPage,
            limit: initialLimit,
            total: 0,
            totalPages: 0,
        },
        loading: isLoading,
        error: error as Error | null,
        fetchOrders: refetch,
        cancelOrder: (orderId: string) =>
            cancelOrderMutation.mutateAsync(orderId),
        fetchNextPage,
        fetchPreviousPage,
        isCancelling: cancelOrderMutation.isPending,
    };
}
