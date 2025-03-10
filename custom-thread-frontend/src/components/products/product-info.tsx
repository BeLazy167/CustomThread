import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    MinusIcon,
    PlusIcon,
    Trash2,
    Loader2,
    ShoppingCart,
    Star,
    Truck,
    RefreshCw,
    Check,
    ChevronDown,
    ChevronUp,
    Info,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useAddToCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface ProductData {
    id: string;
    name: string;
    price: number;
    description?: string;
    image: string;
    decal?: string;
    isCustomDesign?: boolean;
}

interface ProductInfoProps {
    productData?: ProductData | null;
}

export default function ProductInfo({ productData }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState("M");
    const [isFavorited, setIsFavorited] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<string | null>("description");
    const addToCart = useAddToCart();

    // Default product data if none is provided
    const product = productData || {
        id: "default",
        name: "UltraComfort Tee",
        price: 29.99,
        description:
            "Experience ultimate comfort with our UltraComfort Tee. Crafted from premium breathable cotton, this tee offers a soft feel, relaxed fit, and durability for everyday wear.",
        image: "/placeholder.jpg",
    };

    const [cartItems, setCartItems] = useState([
        {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1,
        },
    ]);

    const increaseQuantity = (id: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const removeItem = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleAddToCart = () => {
        try {
            // Create cart item
            const cartItem = {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image || "/placeholder.jpg",
                size: selectedSize,
                quantity: quantity,
                isCustomDesign: product.isCustomDesign || false,
            };

            // Add to cart using React Query mutation
            addToCart.mutate(cartItem);
            toast.success("Added to cart successfully!");
        } catch (error: unknown) {
            console.error("Error in handleAddToCart:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 w-full max-w-md mx-auto md:sticky md:top-8"
        >
            <div>
                {product.isCustomDesign && (
                    <Badge className="mb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white">
                        Custom Design
                    </Badge>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                    {product.name}
                </h1>
                <div className="flex items-center mt-2">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className="h-4 w-4 text-yellow-400 fill-yellow-400"
                            />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                        (24 reviews)
                    </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold mt-3 text-black dark:text-white">
                    ${product.price.toFixed(2)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Art. No. {product.id.padStart(10, "0")}
                </p>
            </div>

            <div className="space-y-2">
                <h2 className="text-sm font-semibold mb-2 text-black dark:text-white">
                    Select size
                </h2>
                <RadioGroup
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    className="flex gap-2 sm:gap-3 flex-wrap"
                >
                    {sizes.map((size) => (
                        <div key={size}>
                            <RadioGroupItem
                                value={size}
                                id={`size-${size}`}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={`size-${size}`}
                                className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-md border-2 text-sm font-medium uppercase cursor-pointer transition-all
                                    ${
                                        selectedSize === size
                                            ? "bg-primary border-primary text-white"
                                            : "border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
                                    }`}
                            >
                                {size}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="pt-2 space-y-4">
                <div className="flex items-center">
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-md">
                        <button
                            onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                            }
                            className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            <MinusIcon size={18} />
                        </button>
                        <span className="px-3 py-2 font-medium text-center w-12">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            <PlusIcon size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={handleAddToCart}
                        disabled={addToCart.isPending}
                    >
                        {addToCart.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding to cart...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to cart
                            </>
                        )}
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setIsFavorited(!isFavorited)}
                    >
                        <Heart
                            className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${
                                isFavorited
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-800 dark:text-gray-200"
                            }`}
                        />
                        {isFavorited
                            ? "Saved to favorites"
                            : "Save to favorites"}
                    </Button>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm font-medium">Free shipping</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            For orders over $50
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm font-medium">Easy returns</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            30-day return policy
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Check className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm font-medium">In stock</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Ready to ship
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Accordion Implementation */}
            <div className="border rounded-lg overflow-hidden">
                <div
                    className={`border-b cursor-pointer ${
                        activeTab === "description" ? "border-primary" : ""
                    }`}
                    onClick={() =>
                        setActiveTab(
                            activeTab === "description" ? null : "description"
                        )
                    }
                >
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-sm font-semibold">
                            Product Description
                        </h3>
                        {activeTab === "description" ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </div>
                </div>
                <AnimatePresence>
                    {activeTab === "description" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {product.description}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    className={`border-b cursor-pointer ${
                        activeTab === "shipping" ? "border-primary" : ""
                    }`}
                    onClick={() =>
                        setActiveTab(
                            activeTab === "shipping" ? null : "shipping"
                        )
                    }
                >
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-sm font-semibold">
                            Shipping & Returns
                        </h3>
                        {activeTab === "shipping" ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </div>
                </div>
                <AnimatePresence>
                    {activeTab === "shipping" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <p>
                                    Free standard shipping on orders over $50.
                                </p>
                                <p>Express shipping available at checkout.</p>
                                <p>
                                    Returns accepted within 30 days of delivery.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    className={`cursor-pointer ${
                        activeTab === "care" ? "border-primary" : ""
                    }`}
                    onClick={() =>
                        setActiveTab(activeTab === "care" ? null : "care")
                    }
                >
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-sm font-semibold">
                            Care Instructions
                        </h3>
                        {activeTab === "care" ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </div>
                </div>
                <AnimatePresence>
                    {activeTab === "care" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <p>Machine wash cold with similar colors.</p>
                                <p>Do not bleach. Tumble dry low.</p>
                                <p>Cool iron if needed. Do not dry clean.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <SheetContent className="w-full sm:max-w-lg flex flex-col h-screen backdrop-blur-lg bg-white/80 dark:bg-black/60">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold">
                            Your Shopping Cart
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-grow overflow-y-auto mt-6 space-y-6 px-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-24 w-20 rounded-lg object-cover border"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/placeholder.jpg";
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Size: {item.size}
                                    </p>
                                    <p className="text-lg font-semibold mt-1">
                                        ${item.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <MinusIcon
                                            size={22}
                                            className="text-black dark:text-white hover:text-red-500 transition-all cursor-pointer"
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                        />
                                        <span className="text-lg font-semibold min-w-[32px] text-center">
                                            {item.quantity}
                                        </span>
                                        <PlusIcon
                                            size={22}
                                            className="text-black dark:text-white hover:text-green-500 transition-all cursor-pointer"
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                        />
                                    </div>
                                </div>
                                <Trash2
                                    size={22}
                                    className="text-red-500 hover:text-red-700 transition-all cursor-pointer"
                                    onClick={() => removeItem(item.id)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border-t p-4 bg-white dark:bg-black sticky bottom-0">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Subtotal:</span>
                            <span>
                                $
                                {cartItems
                                    .reduce(
                                        (total, item) =>
                                            total + item.price * item.quantity,
                                        0
                                    )
                                    .toFixed(2)}
                            </span>
                        </div>
                        <Button
                            className="w-full mt-4"
                            size="lg"
                            onClick={() => setIsCheckoutOpen(true)}
                        >
                            Checkout
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
