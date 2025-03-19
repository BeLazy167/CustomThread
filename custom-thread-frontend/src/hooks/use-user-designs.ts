import { useState, useEffect } from "react";
import { designApi } from "../services/api";
import { useUser } from "@clerk/clerk-react";

export interface UserDesign {
    id: string;
    title: string;
    image: string;
    views: number;
    likes: number;
    comments: number;
    createdAt: string;
    status: "draft" | "published";
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface UseUserDesignsReturn {
    designs: UserDesign[];
    loading: boolean;
    error: Error | null;
    pagination: PaginationData;
    fetchNextPage: () => void;
    fetchPreviousPage: () => void;
    refetch: () => Promise<void>;
}

export function useUserDesigns(
    initialPage = 1,
    limit = 10
): UseUserDesignsReturn {
    const { user } = useUser();
    const [designs, setDesigns] = useState<UserDesign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: initialPage,
        limit,
        totalPages: 0,
    });

    const fetchDesigns = async (page: number) => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const response = await designApi.getUserDesigns(user.id, {
                page,
                limit,
            });
            setDesigns(response.designs);
            setPagination(response.pagination);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error("Failed to fetch designs")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns(initialPage);
    }, [user?.id, initialPage]);

    const fetchNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            fetchDesigns(pagination.page + 1);
        }
    };

    const fetchPreviousPage = () => {
        if (pagination.page > 1) {
            fetchDesigns(pagination.page - 1);
        }
    };

    const refetch = () => fetchDesigns(pagination.page);

    return {
        designs,
        loading,
        error,
        pagination,
        fetchNextPage,
        fetchPreviousPage,
        refetch,
    };
}
