import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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

const ProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useDesigns();

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Explore Designs</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Browse through our collection of custom designs created by
                    talented artists. Find the perfect design for your next
                    custom apparel.
                </p>
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
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(data?.designs || []).map((design: Design) => (
                        <motion.div
                            key={design.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -5 }}
                            onClick={() =>
                                navigate(`/product-info/${design.id}`)
                            }
                            className="cursor-pointer"
                        >
                            <Card className="overflow-hidden h-full">
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
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-1">
                                        {design.designDetail?.title ||
                                            "Untitled Design"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        by {design.userName || "Unknown Artist"}
                                    </p>
                                    <p className="text-lg font-bold">
                                        $
                                        {design.designDetail?.price?.toFixed(
                                            2
                                        ) || "29.99"}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
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
