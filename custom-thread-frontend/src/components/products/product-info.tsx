import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, MinusIcon, PlusIcon, Trash2, Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useAddToCart } from "@/hooks/use-cart";
import { toast } from "sonner";

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
                quantity: 1,
                isCustomDesign: product.isCustomDesign || false,
            };

            // Add to cart using React Query mutation
            addToCart.mutate(cartItem);
        } catch (error: unknown) {
            console.error("Error in handleAddToCart:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto md:sticky md:top-8">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-black dark:text-white">
                    {product.name}
                </h1>
                <p className="text-lg sm:text-xl font-bold mt-1 text-black dark:text-white">
                    ${product.price.toFixed(2)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Art. No. {product.id.padStart(10, "0")}
                </p>
                {product.isCustomDesign && (
                    <div className="mt-2">
                        <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            Custom Design
                        </span>
                    </div>
                )}
            </div>

            <div>
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
                                className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 border text-sm uppercase cursor-pointer transition-all
                  ${
                      selectedSize === size
                          ? "bg-black text-white"
                          : "border-gray-400 text-black hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  }`}
                            >
                                {size}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 pt-2">
                <Button
                    size="lg"
                    className="w-full bg-black text-white hover:bg-black"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                >
                    {addToCart.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding to bag...
                        </>
                    ) : (
                        "Add to bag"
                    )}
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white"
                    onClick={() => setIsFavorited(!isFavorited)}
                >
                    <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${
                            isFavorited
                                ? "text-red-500 fill-red-500"
                                : "text-black dark:text-white"
                        }`}
                    />{" "}
                    Save to favorites
                </Button>
            </div>

            {/* Product Description */}
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                {product.description}
            </p>

            <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <SheetContent className="w-full sm:max-w-lg flex flex-col h-screen backdrop-blur-lg bg-white/80 dark:bg-black/60">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold">
                            Your Shopping Bag
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
        </div>
    );
}
