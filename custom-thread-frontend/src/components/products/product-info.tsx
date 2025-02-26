import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const loadingStates = [
    { text: "Validating your payment" },
    { text: "Processing your order" },
    { text: "Confirming with the vendor" },
    { text: "Packing your items" },
    { text: "Preparing for shipment" },
    { text: "Finalizing transaction" },
    { text: "Payment Successful 🎉" },
];

export default function ProductInfo() {
    const [selectedSize, setSelectedSize] = useState("M");
    const [isFavorited, setIsFavorited] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "UltraComfort Tee",
            price: 29.99,
            image: "/placeholder.jpg",
            size: "M",
            quantity: 1,
        },
        {
            id: 2,
            name: "Premium Joggers",
            price: 49.99,
            image: "/placeholder.jpg",
            size: "L",
            quantity: 2,
        },
    ]);

    const increaseQuantity = (id: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleAddToCart = () => {
        setIsCheckoutOpen(true);
    };

    const handleCheckout = () => {
        setIsCheckoutOpen(false);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/checkout");
        }, loadingStates.length * 1000);
    };

    return (
        <div className="sticky top-8 space-y-6 max-w-md mx-auto">
            <div>
                <h1 className="text-2xl font-semibold text-black dark:text-white">
                    UltraComfort Tee
                </h1>
                <p className="text-xl font-bold mt-1 text-black dark:text-white">
                    $29.99
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Art. No. 0123456789
                </p>
            </div>

            <div>
                <h2 className="text-sm font-semibold mb-2 text-black dark:text-white">
                    Select size
                </h2>
                <RadioGroup
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    className="flex gap-3 flex-wrap"
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
                                className={`flex items-center justify-center w-16 h-16 border text-sm uppercase cursor-pointer transition-all
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

            <div className="flex flex-col gap-3">
                <Button
                    size="lg"
                    className="w-full bg-black text-white hover:bg-black"
                    onClick={handleAddToCart}
                >
                    Add to bag
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white"
                    onClick={() => setIsFavorited(!isFavorited)}
                >
                    <Heart
                        className={`h-5 w-5 mr-2 ${
                            isFavorited
                                ? "text-red-500 fill-red-500"
                                : "text-black dark:text-white"
                        }`}
                    />{" "}
                    Save to favorites
                </Button>
            </div>

            {/* ✅ Product Description Added Below "Save to Favorites" Button */}
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Experience ultimate comfort with our UltraComfort Tee. Crafted
                from premium breathable cotton, this tee offers a soft feel,
                relaxed fit, and durability for everyday wear. Perfect for
                casual outings, gym sessions, or just lounging in style.
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
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Loader
                loadingStates={loadingStates}
                loading={loading}
                duration={1000}
            />
        </div>
    );
}
