import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store";
import { Separator } from "@/components/ui/separator";
import {
    ShoppingBag,
    Shield,
    Check,
    Lock as LockIcon,
    Clock,
    Zap,
    CreditCard,
    ArrowLeft,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { orderApi } from "@/services/api";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { countries, getRegionsByCountry } from "@/data/location-data";

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
        address2: "",
        city: "",
        state: "",
        contact: "",
        country: "US", // Default to United States
        postalCode: "",
    });

    // Track the selected country code to show appropriate regions
    const [selectedCountryCode, setSelectedCountryCode] = useState("US");

    // Get regions based on selected country
    const regions = getRegionsByCountry(selectedCountryCode);

    // Set a default value for payment validation
    // const [isPaymentValid, setIsPaymentValid] = useState(true);
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

    // Handle select changes (for dropdowns)
    const handleSelectChange = (name: string, value: string) => {
        setShippingDetails((prev) => ({
            ...prev,
            [name]: value,
        }));

        // If country changes, update the selectedCountryCode and reset state/province
        if (name === "country") {
            setSelectedCountryCode(value);
            setShippingDetails((prev) => ({
                ...prev,
                state: "",
            }));
        }
    };

    const validateForm = () => {
        const requiredFields = [
            "name",
            "email",
            "address",
            "city",
            "state",
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
                price: item.price,
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

            console.log(
                "Sending checkout data:",
                JSON.stringify(checkoutData, null, 2)
            );

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
            const response = await orderApi.createCheckoutSession(checkoutData);
            console.log("Checkout response:", response);

            if (response && response.url) {
                // Redirect to Stripe checkout page
                window.location.href = response.url;
            } else {
                throw new Error("No URL returned from checkout session");
            }
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
            {/* Checkout Header with Progress */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-3 text-center">
                    Checkout
                </h1>
                <p className="text-muted-foreground text-center mb-6">
                    Complete your purchase securely
                </p>

                {/* Progress Steps */}
                <div className="flex items-center justify-center max-w-2xl mx-auto">
                    <div className="flex items-center w-full">
                        <div className="relative flex flex-col items-center flex-1">
                            <div className="rounded-full h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center z-10 shadow-md">
                                <Check className="h-5 w-5" />
                            </div>
                            <div className="text-xs mt-2 font-medium text-foreground">
                                Cart
                            </div>
                        </div>
                        <div className="flex-1 h-1 bg-primary"></div>
                        <div className="relative flex flex-col items-center flex-1">
                            <div className="rounded-full h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center z-10 shadow-md">
                                <span className="font-medium">2</span>
                            </div>
                            <div className="text-xs mt-2 font-medium text-foreground">
                                Shipping
                            </div>
                        </div>
                        <div className="flex-1 h-1 bg-muted"></div>
                        <div className="relative flex flex-col items-center flex-1">
                            <div className="rounded-full h-10 w-10 bg-muted text-muted-foreground flex items-center justify-center z-10 border border-border">
                                <span className="font-medium">3</span>
                            </div>
                            <div className="text-xs mt-2 text-muted-foreground">
                                Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column - Shipping Information */}
                <div className="space-y-10">
                    <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-xl font-semibold">
                                Shipping Information
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium flex items-center"
                                    >
                                        Full Name{" "}
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="John Doe"
                                        value={shippingDetails.name}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium flex items-center"
                                    >
                                        Email{" "}
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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
                                    className="text-sm font-medium flex items-center"
                                >
                                    Address{" "}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="123 Main St"
                                    value={shippingDetails.address}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete="street-address"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="address2"
                                    className="text-sm font-medium"
                                >
                                    Address Line 2{" "}
                                    <span className="text-muted-foreground text-xs">
                                        (Optional)
                                    </span>
                                </label>
                                <input
                                    id="address2"
                                    name="address2"
                                    className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="Apt, Suite, Unit, etc."
                                    value={shippingDetails.address2}
                                    onChange={handleInputChange}
                                    autoComplete="address-line2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="city"
                                        className="text-sm font-medium flex items-center"
                                    >
                                        City{" "}
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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
                                        className="text-sm font-medium flex items-center"
                                    >
                                        Postal Code{" "}
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="postalCode"
                                        name="postalCode"
                                        className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="10001"
                                        value={shippingDetails.postalCode}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="postal-code"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="country"
                                        className="text-sm font-medium flex items-center"
                                    >
                                        Country{" "}
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <Select
                                        value={shippingDetails.country}
                                        onValueChange={(value) =>
                                            handleSelectChange("country", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="country"
                                            className="w-full px-4 py-3 border border-input bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        >
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px] bg-card text-card-foreground border-border">
                                            {countries.map((country) => (
                                                <SelectItem
                                                    key={country.code}
                                                    value={country.code}
                                                >
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="state"
                                        className="text-sm font-medium flex items-center"
                                    >
                                        {selectedCountryCode === "US"
                                            ? "State"
                                            : selectedCountryCode === "CA"
                                            ? "Province"
                                            : "State/Region"}{" "}
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    {regions.length > 0 ? (
                                        <Select
                                            value={shippingDetails.state}
                                            onValueChange={(value) =>
                                                handleSelectChange(
                                                    "state",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="state"
                                                className="w-full px-4 py-3 border border-input bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                            >
                                                <SelectValue
                                                    placeholder={`Select a ${
                                                        selectedCountryCode ===
                                                        "US"
                                                            ? "state"
                                                            : selectedCountryCode ===
                                                              "CA"
                                                            ? "province"
                                                            : "region"
                                                    }`}
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px] bg-card text-card-foreground border-border">
                                                {regions.map((region) => (
                                                    <SelectItem
                                                        key={region.code}
                                                        value={region.code}
                                                    >
                                                        {region.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <input
                                            id="state"
                                            name="state"
                                            className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                            placeholder="State/Province/Region"
                                            value={shippingDetails.state}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete="address-level1"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="contact"
                                    className="text-sm font-medium flex items-center"
                                >
                                    Phone Number{" "}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="contact"
                                    name="contact"
                                    className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="+1 (555) 123-4567"
                                    value={shippingDetails.contact}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete="tel"
                                />
                            </div>
                        </div>

                        <div className="mt-10 space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-lg font-medium">
                                    Shipping Method
                                </h3>
                                <span className="text-red-500">*</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div
                                    className={cn(
                                        "relative flex cursor-pointer rounded-lg border p-5",
                                        "transition-all duration-200 hover:shadow-md",
                                        shippingMethod === "standard"
                                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                                            : "border-input hover:bg-accent/50"
                                    )}
                                    onClick={() =>
                                        setShippingMethod("standard")
                                    }
                                >
                                    <div
                                        className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-transparent pointer-events-none transition-all duration-200"
                                        style={{
                                            borderColor:
                                                shippingMethod === "standard"
                                                    ? "var(--primary)"
                                                    : "transparent",
                                            opacity:
                                                shippingMethod === "standard"
                                                    ? 1
                                                    : 0,
                                        }}
                                    />
                                    <div className="mr-4 flex-shrink-0">
                                        <div
                                            className={cn(
                                                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                                shippingMethod === "standard"
                                                    ? "border-primary"
                                                    : "border-muted-foreground/30"
                                            )}
                                        >
                                            {shippingMethod === "standard" && (
                                                <div className="h-3 w-3 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-base font-medium">
                                                Standard Shipping
                                            </p>
                                            <p className="text-base font-semibold">
                                                $
                                                {standardShippingCost.toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
                                                3-5 business days
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        "relative flex cursor-pointer rounded-lg border p-5",
                                        "transition-all duration-200 hover:shadow-md",
                                        shippingMethod === "express"
                                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                                            : "border-input hover:bg-accent/50"
                                    )}
                                    onClick={() => setShippingMethod("express")}
                                >
                                    <div
                                        className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-transparent pointer-events-none transition-all duration-200"
                                        style={{
                                            borderColor:
                                                shippingMethod === "express"
                                                    ? "var(--primary)"
                                                    : "transparent",
                                            opacity:
                                                shippingMethod === "express"
                                                    ? 1
                                                    : 0,
                                        }}
                                    />
                                    <div className="mr-4 flex-shrink-0">
                                        <div
                                            className={cn(
                                                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                                shippingMethod === "express"
                                                    ? "border-primary"
                                                    : "border-muted-foreground/30"
                                            )}
                                        >
                                            {shippingMethod === "express" && (
                                                <div className="h-3 w-3 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-base font-medium">
                                                Express Shipping
                                            </p>
                                            <p className="text-base font-semibold">
                                                $
                                                {expressShippingCost.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Zap className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
                                                1-2 business days
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 text-base font-medium"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Cart
                                </Button>

                                <Button
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 text-base font-medium bg-primary hover:bg-primary/90 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            Proceed to Payment
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </div>

                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                <p>
                                    Need help?{" "}
                                    <span className="text-primary hover:underline cursor-pointer">
                                        Contact our support team
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                        <h3 className="text-xl font-semibold mb-6">
                            Payment Method
                        </h3>

                        <div className="space-y-4">
                            <div className="relative border p-5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer ring-1 ring-primary/30 shadow-sm">
                                <div className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-primary pointer-events-none" />
                                <div className="flex items-center space-x-4">
                                    <div className="h-6 w-6 rounded-full border-2 border-primary flex items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-medium block">
                                            Credit/Debit Card
                                        </span>
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm text-muted-foreground mr-3">
                                                Powered by Stripe
                                            </span>
                                            <div className="flex space-x-1">
                                                <div className="h-6 w-10 bg-[#635BFF] rounded flex items-center justify-center">
                                                    <CreditCard className="h-3.5 w-3.5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                                            <img
                                                src="/visa.svg"
                                                alt="Visa"
                                                className="h-4"
                                            />
                                        </div>
                                        <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                                            <img
                                                src="/mastercard.svg"
                                                alt="Mastercard"
                                                className="h-4"
                                            />
                                        </div>
                                        <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                                            <img
                                                src="/amex.svg"
                                                alt="American Express"
                                                className="h-4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative border p-5 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer opacity-50">
                                <div className="flex items-center space-x-4">
                                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center"></div>
                                    <div className="flex-1">
                                        <span className="font-medium block">
                                            PayPal
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            Coming soon
                                        </span>
                                    </div>
                                    <div className="h-8 w-16 bg-muted rounded flex items-center justify-center">
                                        <img
                                            src="/paypal.svg"
                                            alt="PayPal"
                                            className="h-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 flex items-center gap-4 border border-primary/10">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-medium">
                                Secure Payment Processing
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your payment information is encrypted and secure
                                with Stripe. We never store your full card
                                details on our servers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div>
                    <div className="bg-card border border-border rounded-lg p-8 shadow-sm sticky top-6">
                        <div className="flex items-center gap-3 mb-8">
                            <ShoppingBag className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-semibold">
                                Order Summary
                            </h2>
                            <span className="text-sm text-muted-foreground ml-auto">
                                {items.length}{" "}
                                {items.length === 1 ? "item" : "items"}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {/* Cart Items */}
                            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50"
                                    >
                                        <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-medium">
                                                {item.name}
                                            </h4>
                                            <div className="flex flex-wrap gap-x-4 mt-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Size:{" "}
                                                    <span className="font-medium text-foreground">
                                                        {item.size}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty:{" "}
                                                    <span className="font-medium text-foreground">
                                                        {item.quantity}
                                                    </span>
                                                </p>
                                            </div>
                                            <p className="text-base font-medium mt-2">
                                                $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-6" />

                            {/* Subtotal */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="text-sm font-medium">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Shipping
                                    </span>
                                    <span className="text-sm font-medium">
                                        ${shippingCost.toFixed(2)}
                                    </span>
                                </div>

                                {/* Taxes */}
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Taxes
                                    </span>
                                    <span className="text-sm font-medium">
                                        ${tax.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Total */}
                            <div className="flex justify-between">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold">
                                    ${finalTotal.toFixed(2)}
                                </span>
                            </div>

                            {/* Checkout Button for Mobile */}
                            <div className="mt-8 lg:hidden">
                                <Button
                                    className="w-full py-3 text-base font-medium bg-primary hover:bg-primary/90 transition-colors"
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            Proceed to Payment
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full mt-3 py-2.5 text-base"
                                    onClick={() => navigate("/products")}
                                    disabled={isSubmitting}
                                >
                                    Continue Shopping
                                </Button>
                            </div>

                            {/* Secure checkout message */}
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-8 bg-muted/50 p-3 rounded-md">
                                <LockIcon className="h-4 w-4" />
                                <span>Secure checkout powered by Stripe</span>
                            </div>

                            <p className="text-center text-xs text-muted-foreground mt-3">
                                By completing your order, you agree to our{" "}
                                <span className="underline cursor-pointer">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="underline cursor-pointer">
                                    Privacy Policy
                                </span>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
