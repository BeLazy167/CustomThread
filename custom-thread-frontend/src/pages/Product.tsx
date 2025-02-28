"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductInfo from "../components/products/product-info";
import { ZoomModal } from "../components/products/zoom-modal";
import { useDesign } from "@/hooks/use-designs";
import { Loader2 } from "lucide-react";
import tShirt from "../assets/tShirt.webp";
import { toast } from "sonner";

// Default product data for fallback
const defaultProducts = {
    "5128": {
        id: "5128",
        name: "Hoodie",
        price: 65.0,
        image: tShirt,
        category: "Hoodies",
        description: "Premium quality hoodie with striking venom design.",
    },
    "8049": {
        id: "8049",
        name: "Black Tee",
        price: 42.0,
        image: tShirt,
        category: "T-shirts",
        description: "Stylish twofer with unique tree camo pattern.",
    },
    "5125": {
        id: "5125",
        name: "The Dawn Collection - Hoodies",
        price: 55.0,
        image: tShirt,
        category: "Hoodies",
        description: "Part of the Dawn Collection featuring skull artwork.",
    },
    "2117": {
        id: "2117",
        name: "The Dawn Collection - T-shirts",
        price: 55.0,
        image: tShirt,
        category: "T-shirts",
        description: "Premium sweatpants from the Dawn Collection.",
    },
};

export default function Product() {
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch design data using React Query
    const { data, isLoading, isError, error } = useDesign(id || "");

    // Log data for debugging
    useEffect(() => {
        console.log("Product data:", data);
        if (isError) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product data");
        }
    }, [data, isError, error]);

    // If loading, show loading spinner
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Check if we have a design from the API
    // The response structure might be different based on your backend
    // It could be data.design, data, or some other structure
    const design = data;

    // Check if we should use a default product
    const defaultProduct = id
        ? defaultProducts[id as keyof typeof defaultProducts]
        : null;

    // Determine which product data to use
    let productData;
    let imageSrc;

    if (design) {
        // Use API data
        productData = {
            id: design.id,
            name: design.designDetail?.title || "Custom Design",
            price: design.designDetail?.price || 29.99,
            description:
                design.designDetail?.description || "A premium custom design",
            image: design.image,
            decal: design.decal,
            isCustomDesign: true,
        };
        imageSrc = design.image || tShirt;
    } else if (defaultProduct) {
        // Use default product data
        productData = {
            id: defaultProduct.id,
            name: defaultProduct.name,
            price: defaultProduct.price,
            description: defaultProduct.description,
            image: defaultProduct.image,
            isCustomDesign: false,
        };
        imageSrc = defaultProduct.image;
    } else {
        // No product found
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Product not found
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        The product you're looking for doesn't exist
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                    {/* Product Images Section */}
                    <div className="space-y-3 md:space-y-4">
                        {/* Main product image */}
                        <div
                            className="cursor-zoom-in rounded-lg overflow-hidden"
                            onClick={() => setIsZoomOpen(true)}
                        >
                            <img
                                src={imageSrc}
                                alt={productData.name}
                                className="w-full h-auto object-cover shadow-md"
                                onError={(e) => {
                                    e.currentTarget.src = tShirt;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                        </div>

                        {/* Decal image - show side by side on mobile, stacked on desktop */}
                        {productData.decal && (
                            <div
                                className="cursor-zoom-in rounded-lg overflow-hidden"
                                onClick={() => {
                                    setIsZoomOpen(true);
                                }}
                            >
                                <img
                                    src={productData.decal}
                                    alt={`${productData.name} Decal`}
                                    className="w-full h-auto object-cover shadow-md"
                                    onError={(e) => {
                                        e.currentTarget.src = tShirt;
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="mt-4 md:mt-0">
                        <ProductInfo productData={productData} />
                    </div>
                </div>
            </div>
            <ZoomModal
                isOpen={isZoomOpen}
                onClose={() => setIsZoomOpen(false)}
                imageSrc={imageSrc}
                decalSrc={productData.decal}
            />
        </div>
    );
}
