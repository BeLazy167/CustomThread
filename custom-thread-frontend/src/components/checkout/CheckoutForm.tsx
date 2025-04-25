import { useState } from "react";
import { useCartStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { orderApi } from "@/services/api";

interface ShippingDetails {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    contact: string;
    country: string;
    postalCode: string;
}

export function CheckoutForm() {
    const { toast } = useToast();
    const { items } = useCartStore();
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        contact: "",
        country: "",
        postalCode: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
                shippingDetails,
            };

            // Save cart items to sessionStorage for potential recovery
            sessionStorage.setItem(
                "pendingCheckout",
                JSON.stringify({
                    items,
                    shippingDetails,
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
        }
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
            (field) => !shippingDetails[field as keyof ShippingDetails]
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={shippingDetails.name}
                        onChange={handleInputChange}
                        required
                        autoComplete="name"
                    />
                </div>

                <div className="space-y-2 col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={shippingDetails.email}
                        onChange={handleInputChange}
                        required
                        autoComplete="email"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    required
                    autoComplete="street-address"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        required
                        autoComplete="address-level2"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                        id="postalCode"
                        name="postalCode"
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
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        name="country"
                        placeholder="United States"
                        value={shippingDetails.country}
                        onChange={handleInputChange}
                        required
                        autoComplete="country-name"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contact">Phone Number</Label>
                    <Input
                        id="contact"
                        name="contact"
                        placeholder="+1 (555) 123-4567"
                        value={shippingDetails.contact}
                        onChange={handleInputChange}
                        required
                        autoComplete="tel"
                    />
                </div>
            </div>
        </form>
    );
}
