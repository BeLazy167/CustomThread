import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Loader2,
    Search,
    Filter,
    ArrowUpDown,
    ShoppingBag,
    Palette,
} from "lucide-react";
import { useDesigns } from "@/hooks/use-designs";

// Define interface for design object
interface Design {
    id: string;
    userId: string;
    image: string;
    userName: string;
    designDetail?: {
        title?: string;
        price?: number;
        description?: string;
        tags?: string[];
    };
}

type SortOption = "newest" | "price-low" | "price-high" | "name";

const ProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useDesigns();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Extract all unique tags from designs
    const allTags = useMemo(() => {
        if (!data?.designs) return [];

        const tagsSet = new Set<string>();
        data.designs.forEach((design: Design) => {
            design.designDetail?.tags?.forEach((tag) => {
                tagsSet.add(tag);
            });
        });

        return Array.from(tagsSet);
    }, [data?.designs]);

    // Filter and sort designs
    const filteredDesigns = useMemo(() => {
        if (!data?.designs) return [];

        return data.designs
            .filter((design: Design) => {
                // Filter by search query
                const matchesSearch =
                    searchQuery === "" ||
                    design.designDetail?.title
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    design.userName
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    design.designDetail?.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());

                // Filter by selected tag
                const matchesTag =
                    !selectedTag ||
                    design.designDetail?.tags?.includes(selectedTag);

                return matchesSearch && matchesTag;
            })
            .sort((a: Design, b: Design) => {
                // Sort based on selected option
                switch (sortBy) {
                    case "price-low":
                        return (
                            (a.designDetail?.price || 0) -
                            (b.designDetail?.price || 0)
                        );
                    case "price-high":
                        return (
                            (b.designDetail?.price || 0) -
                            (a.designDetail?.price || 0)
                        );
                    case "name":
                        return (a.designDetail?.title || "").localeCompare(
                            b.designDetail?.title || ""
                        );
                    case "newest":
                    default:
                        return 0; // Assuming the API returns in newest first order
                }
            });
    }, [data?.designs, searchQuery, sortBy, selectedTag]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Explore Designs
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Browse through our collection of custom designs created by
                    talented artists. Find the perfect design for your next
                    custom apparel.
                </p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-4 mb-8 border dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-auto flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search designs..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={selectedTag || "all"}
                                onValueChange={(value) =>
                                    setSelectedTag(
                                        value === "all" ? null : value
                                    )
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Tags
                                    </SelectItem>
                                    {allTags.map((tag) => (
                                        <SelectItem key={tag} value={tag}>
                                            {tag}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={sortBy}
                                onValueChange={(value: SortOption) =>
                                    setSortBy(value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">
                                        Newest
                                    </SelectItem>
                                    <SelectItem value="price-low">
                                        Price: Low to High
                                    </SelectItem>
                                    <SelectItem value="price-high">
                                        Price: High to Low
                                    </SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : isError ? (
                <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-8 rounded-xl">
                    <p className="text-lg mb-2">
                        Failed to load designs. Please try again later.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            ) : filteredDesigns.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border dark:border-slate-800">
                    <p className="text-lg text-muted-foreground mb-2">
                        No designs found matching your criteria.
                    </p>
                    {(searchQuery || selectedTag) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedTag(null);
                            }}
                            className="mt-4"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <p className="text-sm text-muted-foreground mb-4">
                        Showing {filteredDesigns.length} designs
                    </p>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {filteredDesigns.map((design: Design) => (
                                <motion.div
                                    key={design.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    onClick={() =>
                                        navigate(`/product-info/${design.id}`)
                                    }
                                    className="cursor-pointer"
                                    layout
                                >
                                    <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-slate-900 dark:border-slate-800">
                                        <div className="relative aspect-square overflow-hidden group">
                                            <img
                                                src={design.image}
                                                alt={
                                                    design.designDetail
                                                        ?.title || "Design"
                                                }
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <ShoppingBag className="h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </div>
                                            {design.designDetail?.price && (
                                                <div className="absolute top-3 right-3 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                                                    $
                                                    {design.designDetail.price.toFixed(
                                                        2
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-semibold line-clamp-1">
                                                    {design.designDetail
                                                        ?.title ||
                                                        "Untitled Design"}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Palette className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    by{" "}
                                                    {design.userName ||
                                                        "Unknown Artist"}
                                                </p>
                                            </div>
                                            {design.designDetail?.tags &&
                                                design.designDetail.tags
                                                    .length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-3">
                                                        {design.designDetail.tags
                                                            .slice(0, 3)
                                                            .map((tag) => (
                                                                <Badge
                                                                    key={tag}
                                                                    variant="outline"
                                                                    className="bg-slate-100 dark:bg-slate-800 text-xs"
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        {design.designDetail
                                                            .tags.length >
                                                            3 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-slate-100 dark:bg-slate-800 text-xs"
                                                            >
                                                                +
                                                                {design
                                                                    .designDetail
                                                                    .tags
                                                                    .length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}

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
                                className={
                                    data.page === i + 1
                                        ? "bg-primary hover:bg-primary/90"
                                        : ""
                                }
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
