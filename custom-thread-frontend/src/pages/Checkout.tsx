import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { orderApi } from "@/services/api";
import { cn } from "@/lib/utils";

export default function Checkout() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { items, total } = useCartStore();
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        contact: "",
        country: "",
        postalCode: "",
    });
    const standardShippingCost = 10.0;
    const expressShippingCost = 20.0;
    const tax = total * 0.08;
    const shippingCost =
        shippingMethod === "express"
            ? expressShippingCost
            : standardShippingCost;
    const finalTotal = total + tax + shippingCost;

    // Redirect to products page if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            navigate("/products");
        }
    }, [items, navigate]);

    if (items.length === 0) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const requiredFields = [
            "name",
            "email",
            "address",
            "city",
            "contact",
            "country",
            "postalCode",
        ];
        const emptyFields = requiredFields.filter(
            (field) => !shippingDetails[field as keyof typeof shippingDetails]
        );

        if (emptyFields.length > 0) {
            toast({
                title: "Missing Information",
                description: `Please fill in all required fields: ${emptyFields.join(
                    ", "
                )}`,
                variant: "destructive",
            });
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shippingDetails.email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Format the cart items for the API
            const checkoutItems = items.map((item) => ({
                designId: item.productId,
                quantity: item.quantity,
                size: item.size,
                customizations: {}, // Add any customizations if needed
            }));

            // Create the checkout session request
            const checkoutData = {
                items: checkoutItems,
                shippingDetails: {
                    ...shippingDetails,
                    shippingMethod,
                },
            };

            // Save cart items to sessionStorage for potential recovery
            sessionStorage.setItem(
                "pendingCheckout",
                JSON.stringify({
                    items,
                    shippingDetails,
                    shippingMethod,
                })
            );

            // Use the orderApi service to create checkout session
            const { url } = await orderApi.createCheckoutSession(checkoutData);

            // Redirect to Stripe checkout page
            window.location.href = url;
        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Checkout Failed",
                description:
                    "There was an error processing your checkout. Please try again.",
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <h1 className="text-3xl font-bold mb-2 text-center">Checkout</h1>
            <p className="text-muted-foreground text-center mb-8">
                Complete your purchase securely
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Shipping Information */}
                <div className="space-y-8">
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-lg font-semibold">
                                Shipping Information
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                        placeholder="John Doe"
                                        value={shippingDetails.name}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="name"
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                        placeholder="john@example.com"
                                        value={shippingDetails.email}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="address"
                                    className="text-sm font-medium"
                                >
                                    Address
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                    placeholder="123 Main St"
                                    value={shippingDetails.address}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete="street-address"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="city"
                                        className="text-sm font-medium"
                                    >
                                        City
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                        placeholder="New York"
                                        value={shippingDetails.city}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="address-level2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="postalCode"
                                        className="text-sm font-medium"
                                    >
                                        Postal Code
                                    </label>
                                    <input
                                        id="postalCode"
                                        name="postalCode"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                        placeholder="10001"
                                        value={shippingDetails.postalCode}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="postal-code"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="country"
                                        className="text-sm font-medium"
                                    >
                                        Country
                                    </label>
                                    <input
                                        id="country"
                                        name="country"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                        placeholder="United States"
                                        value={shippingDetails.country}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="country-name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="contact"
                                        className="text-sm font-medium"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        id="contact"
                                        name="contact"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                        placeholder="+1 (555) 123-4567"
                                        value={shippingDetails.contact}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-base font-medium">
                                    Shipping Method
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div
                                    className={cn(
                                        "relative flex cursor-pointer flex-col gap-1 rounded-lg border p-4",
                                        "transition-colors duration-200",
                                        shippingMethod === "standard"
                                            ? "border-primary bg-primary/5"
                                            : "border-input hover:bg-accent/50"
                                    )}
                                    onClick={() =>
                                        setShippingMethod("standard")
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">
                                            Standard Shipping
                                        </p>
                                        <p className="text-sm font-semibold">
                                            ${standardShippingCost.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        3-5 business days
                                    </p>
                                </div>

                                <div
                                    className={cn(
                                        "relative flex cursor-pointer flex-col gap-1 rounded-lg border p-4",
                                        "transition-colors duration-200",
                                        shippingMethod === "express"
                                            ? "border-primary bg-primary/5"
                                            : "border-input hover:bg-accent/50"
                                    )}
                                    onClick={() => setShippingMethod("express")}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">
                                            Express Shipping
                                        </p>
                                        <p className="text-sm font-semibold">
                                            ${expressShippingCost.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        1-2 business days
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={isSubmitting}
                            >
                                Back to Cart
                            </Button>

                            <Button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Processing..."
                                    : "Proceed to Payment"}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 flex items-center gap-3 border border-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                            <h3 className="text-sm font-medium">
                                Secure Payment Processing
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Your payment information is encrypted and secure
                                with Stripe
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div>
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-lg font-semibold">
                                Order Summary
                            </h2>
                            <span className="text-sm text-muted-foreground">
                                {items.length}{" "}
                                {items.length === 1 ? "item" : "items"}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* Cart Items */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
                                    >
                                        <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Size: {item.size} • Qty:{" "}
                                                {item.quantity}
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            {/* Subtotal */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Subtotal</span>
                                    <span className="text-sm font-medium">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between">
                                    <span className="text-sm">Shipping</span>
                                    <span className="text-sm font-medium">
                                        ${shippingCost.toFixed(2)}
                                    </span>
                                </div>

                                {/* Taxes */}
                                <div className="flex justify-between">
                                    <span className="text-sm">Taxes</span>
                                    <span className="text-sm font-medium">
                                        ${tax.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Total */}
                            <div className="flex justify-between">
                                <span className="text-base font-bold">
                                    Total
                                </span>
                                <span className="text-base font-bold">
                                    ${finalTotal.toFixed(2)}
                                </span>
                            </div>

                            {/* Checkout Button for Mobile */}
                            <div className="mt-6 lg:hidden">
                                <Button
                                    className="w-full"
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Processing..."
                                        : "Proceed to Payment"}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full mt-2"
                                    onClick={() => navigate("/products")}
                                    disabled={isSubmitting}
                                >
                                    Continue Shopping
                                </Button>
                            </div>

                            {/* Secure checkout message */}
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
                                <ShoppingBag className="h-4 w-4" />
                                <span>Secure checkout powered by Stripe</span>
                            </div>

                            <p className="text-center text-xs text-muted-foreground mt-2">
                                By completing your order, you agree to our Terms
                                of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
