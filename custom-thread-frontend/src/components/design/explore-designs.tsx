import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Share2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useAddToCart } from "@/hooks/use-cart";
import { v4 as uuidv4 } from "uuid";

interface DesignData {
    id: string;
    name: string;
    price: number;
    description?: string;
    image: string;
    designer: string;
    likes: number;
    createdAt: string;
}

interface ExploreDesignProps {
    designData?: DesignData | null;
}

export default function ExploreDesign({ designData }: ExploreDesignProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const addToCart = useAddToCart();

    // Default design data if none is provided
    const design = designData || {
        id: "default",
        name: "Urban Street Art Tee",
        price: 39.99,
        description:
            "A unique street art inspired design featuring bold colors and urban elements. Perfect for those who want to make a statement with their style.",
        image: "/placeholder-design.jpg",
        designer: "StreetArtist92",
        likes: 156,
        createdAt: "2024-02-27",
    };

    const handleAddToCart = (design: DesignData) => {
        const cartItem = {
            id: uuidv4(), // Generate a unique ID
            productId: design.id,
            name: design.name,
            price: design.price,
            image: design.image,
            size: "M", // Default size
            quantity: 1,
            isCustomDesign: true,
        };

        addToCart.mutate(cartItem);
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: design.name,
                text: `Check out this amazing design: ${design.name} by ${design.designer}`,
                url: window.location.href,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    return (
        <div className="sticky top-8 space-y-6 max-w-md mx-auto">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-black dark:text-white">
                            {design.name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            by {design.designer}
                        </p>
                    </div>
                    <p className="text-xl font-bold text-black dark:text-white">
                        ${design.price.toFixed(2)}
                    </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        Custom Design
                    </span>
                    <span className="text-sm text-gray-500">
                        {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Button
                    size="lg"
                    className="w-full bg-black text-white hover:bg-black"
                    onClick={() => handleAddToCart(design)}
                    disabled={addToCart.isPending}
                >
                    {addToCart.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding to cart...
                        </>
                    ) : (
                        "Purchase Design"
                    )}
                </Button>
                <div className="flex gap-2">
                    <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white"
                        onClick={() => setIsFavorited(!isFavorited)}
                    >
                        <Heart
                            className={`h-5 w-5 mr-2 ${
                                isFavorited
                                    ? "text-red-500 fill-red-500"
                                    : "text-black dark:text-white"
                            }`}
                        />
                        {design.likes} Likes
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white"
                        onClick={handleShare}
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Design Description */}
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {design.description}
            </p>

            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="w-full sm:max-w-lg flex flex-col h-screen backdrop-blur-lg bg-white/80 dark:bg-black/60">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold">
                            Design Details
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-grow overflow-y-auto mt-6 space-y-6 px-4">
                        <div className="space-y-4">
                            <img
                                src={design.image}
                                alt={design.name}
                                className="w-full rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {design.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Created by {design.designer}
                                </p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                {design.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Created on{" "}
                                    {new Date(
                                        design.createdAt
                                    ).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {design.likes} likes
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t p-4 bg-white dark:bg-black sticky bottom-0">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => handleAddToCart(design)}
                            disabled={addToCart.isPending}
                        >
                            Purchase for ${design.price.toFixed(2)}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
