import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDesigns } from "@/hooks/use-designs";

// Define interface for design object
interface Design {
    id: string;
    userId: string;
    image: string;
    designDetail?: {
        title?: string;
        price?: number;
        description?: string;
        tags?: string[];
    };
}

export default function ExploreDesigns() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    // Use the appropriate query based on whether we're searching or not
    const designsQuery = useDesigns();
    const searchResults = useDesigns(isSearching ? searchQuery : "");

    // Determine which query result to use
    const { data, isLoading, isError } = isSearching
        ? searchResults
        : designsQuery;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearching(true);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
    };

    const handleDesignClick = (designId: string) => {
        // Navigate to product page with the design ID
        navigate(`/product-info/${designId}`);
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Explore Designs</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Browse through our collection of custom designs created by
                    talented artists. Find the perfect design for your next
                    custom apparel.
                </p>

                {/* Search form */}
                <form
                    onSubmit={handleSearch}
                    className="flex max-w-md mx-auto mt-6 gap-2"
                >
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Search designs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-10"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <Button type="submit" variant="default">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </form>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : isError ? (
                <div className="text-center text-red-500">
                    <p>Failed to load designs. Please try again later.</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            ) : data?.designs?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                        No designs found.
                    </p>
                    {isSearching && (
                        <Button
                            onClick={clearSearch}
                            variant="outline"
                            className="mt-4"
                        >
                            Clear Search
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Use mock data for now, will be replaced with real data */}
                    {(data?.designs || []).map((design: Design) => (
                        <motion.div
                            key={design.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="overflow-hidden h-full flex flex-col">
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={design.image}
                                        alt={
                                            design.designDetail?.title ||
                                            "Design"
                                        }
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-semibold mb-1">
                                        {design.designDetail?.title ||
                                            "Untitled Design"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        by {design.userId || "Unknown Artist"}
                                    </p>
                                    <p className="text-lg font-bold mt-auto mb-4">
                                        $
                                        {design.designDetail?.price?.toFixed(
                                            2
                                        ) || "29.99"}
                                    </p>
                                    <Button
                                        className="w-full gap-2"
                                        onClick={() =>
                                            handleDesignClick(design.id)
                                        }
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                        View Design
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {data?.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                        {Array.from({ length: data.totalPages }, (_, i) => (
                            <Button
                                key={i}
                                variant={
                                    data.page === i + 1 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                    // Handle pagination
                                }}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
