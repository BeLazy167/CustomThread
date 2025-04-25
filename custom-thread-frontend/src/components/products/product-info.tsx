import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useAddToCart } from "@/hooks/use-cart";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { AddToCartAnimation } from "@/components/cart/add-to-cart-animation";
import { findElementWithRetry } from "@/lib/dom-utils";
import { addToCartHaptic } from "@/lib/haptic";

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
    const [isAnimating, setIsAnimating] = useState(false);
    const addToCart = useAddToCart();
    const { toast } = useToast();

    // Reference to the product image for animation
    const productImageRef = useRef<HTMLImageElement>(null);
    // Reference to the cart button in the navbar
    const cartButtonRef = useRef<HTMLElement | null>(null);

    // Find the cart button in the navbar when component mounts
    useEffect(() => {
        // Use our utility function to find the cart button with retry logic
        const findCartButton = async () => {
            const cartButton = await findElementWithRetry(
                '[data-testid="cart-button"]'
            );
            if (cartButton) {
                cartButtonRef.current = cartButton;
            }
        };

        findCartButton();
    }, []);

    // Add bulk order calculation
    const bulkDiscountThreshold = 5; // Apply discount when ordering 5 or more
    const bulkDiscountRate = 0.1; // 10% discount for bulk orders

    // Calculate price with potential bulk discount
    const getPriceWithDiscount = () => {
        if (quantity >= bulkDiscountThreshold) {
            return (product.price * (1 - bulkDiscountRate)).toFixed(2);
        }
        return product.price.toFixed(2);
    };

    // Get total price
    const getTotalPrice = () => {
        const pricePerItem =
            quantity >= bulkDiscountThreshold
                ? product.price * (1 - bulkDiscountRate)
                : product.price;
        return (pricePerItem * quantity).toFixed(2);
    };

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
        if (!selectedSize) {
            toast({
                title: "Please select a size",
                description: "You must select a size before adding to cart",
                variant: "destructive",
            });
            return;
        }

        // Calculate the price with discount if applicable
        const discountedPrice =
            quantity >= bulkDiscountThreshold
                ? product.price * (1 - bulkDiscountRate)
                : product.price;

        const cartItem = {
            id: uuidv4(),
            productId: product.id,
            name: product.name,
            price: discountedPrice, // Use the discounted price
            image: product.image,
            size: selectedSize,
            quantity: quantity,
            isCustomDesign: !!product.isCustomDesign,
        };

        // Start the animation before adding to cart
        if (cartButtonRef.current) {
            // Trigger haptic feedback
            addToCartHaptic();

            // Start animation
            setIsAnimating(true);

            // Add item to cart after a slight delay to allow animation to start
            setTimeout(() => {
                addToCart.mutate(cartItem);
            }, 100);
        } else {
            // Fallback if we can't find the cart button
            addToCart.mutate(cartItem);
            // Still provide haptic feedback even without animation
            addToCartHaptic();
        }

        // Show additional message for bulk orders
        if (quantity >= bulkDiscountThreshold) {
            toast({
                title: "Bulk Discount Applied!",
                description: `You saved ${(bulkDiscountRate * 100).toFixed(
                    0
                )}% on your order of ${quantity} items.`,
                variant: "default",
            });
        }
    };

    // Handle animation completion
    const handleAnimationComplete = () => {
        setIsAnimating(false);
    };

    return (
        <>
            {/* Add to cart animation */}
            <AddToCartAnimation
                isAnimating={isAnimating}
                onAnimationComplete={handleAnimationComplete}
                productImage={product.image}
                targetRef={cartButtonRef}
                quantity={quantity}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 w-full max-w-md mx-auto md:sticky md:top-8"
            >
                <div className="text-center">
                    {product.isCustomDesign && (
                        <Badge className="mb-3 mx-auto inline-flex bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white">
                            Custom Design
                        </Badge>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-2 mb-4 justify-center">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">4.9</span>
                            <span className="text-xs text-gray-500">(128)</span>
                        </div>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                            Art. No. {product.id.slice(-6)}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2 justify-center">
                        <span className="text-2xl font-bold">
                            ${getPriceWithDiscount()}
                        </span>
                        {quantity >= bulkDiscountThreshold && (
                            <>
                                <span className="text-sm line-through text-gray-500 ml-1">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="text-sm text-green-600 dark:text-green-500 font-medium">
                                    (10% off)
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-2 text-center">
                    <h2 className="text-sm font-semibold mb-2 text-black dark:text-white">
                        Select size
                    </h2>
                    <RadioGroup
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                        className="flex gap-2 sm:gap-3 flex-wrap justify-center"
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

                <div className="pt-2 space-y-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Quantity
                            </label>
                            <div className="flex gap-2">
                                {[5, 10, 20].map((qty) => (
                                    <button
                                        key={qty}
                                        onClick={() => setQuantity(qty)}
                                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                                            quantity === qty
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        {qty}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 items-center justify-center">
                            <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-md">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                    aria-label="Decrease quantity"
                                >
                                    <MinusIcon size={18} />
                                </button>
                                <span className="px-3 py-2 font-medium text-center w-12">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                    aria-label="Increase quantity"
                                >
                                    <PlusIcon size={18} />
                                </button>
                            </div>

                            {/* Bulk discount info */}
                            {quantity < bulkDiscountThreshold ? (
                                <div className="text-sm rounded-md py-1 px-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium border border-green-100 dark:border-green-900/30">
                                    Add {bulkDiscountThreshold - quantity} more
                                    for 10% off
                                </div>
                            ) : (
                                <div className="text-sm rounded-md py-1 px-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium border border-green-100 dark:border-green-900/30 flex items-center gap-1">
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Bulk discount applied</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 transition-all duration-200 shadow-sm hover:shadow"
                            onClick={handleAddToCart}
                            disabled={addToCart.isPending}
                        >
                            {addToCart.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Adding to cart...
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {quantity > 1 ? (
                                        <span className="flex items-center gap-1.5">
                                            Add to cart
                                            <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                                                {quantity}
                                            </span>
                                            <span className="font-normal opacity-90">
                                                ${getTotalPrice()}
                                            </span>
                                        </span>
                                    ) : (
                                        "Add to cart"
                                    )}
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
                                className={`h-5 w-5 mr-2 ${
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
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg justify-center">
                        <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Free shipping</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                For orders over $50
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg justify-center">
                        <RefreshCw className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Easy returns</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                30-day return policy
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg justify-center">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
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
                                activeTab === "description"
                                    ? null
                                    : "description"
                            )
                        }
                    >
                        <div className="p-4 text-center relative">
                            <h3 className="text-sm font-semibold">
                                Product Description
                            </h3>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {activeTab === "description" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
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
                                <div className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
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
                        <div className="p-4 text-center relative">
                            <h3 className="text-sm font-semibold">
                                Shipping & Returns
                            </h3>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {activeTab === "shipping" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
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
                                <div className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                                    <p>
                                        Free standard shipping on orders over
                                        $50.
                                    </p>
                                    <p>
                                        Express shipping available at checkout.
                                    </p>
                                    <p>
                                        Returns accepted within 30 days of
                                        delivery.
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
                        <div className="p-4 text-center relative">
                            <h3 className="text-sm font-semibold">
                                Care Instructions
                            </h3>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {activeTab === "care" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
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
                                <div className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                                    <p>
                                        Machine wash cold with similar colors.
                                    </p>
                                    <p>Do not bleach. Tumble dry low.</p>
                                    <p>
                                        Cool iron if needed. Do not dry clean.
                                    </p>
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
                                        ref={productImageRef}
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
                                        <h3 className="font-medium">
                                            {item.name}
                                        </h3>
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
                                                total +
                                                item.price * item.quantity,
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
        </>
    );
}
