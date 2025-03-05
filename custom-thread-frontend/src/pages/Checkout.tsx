import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

export default function Checkout() {
    const navigate = useNavigate();
    const { items, total } = useCartStore();

    // Redirect to products page if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            navigate("/products");
        }
    }, [items, navigate]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div>
                    <CheckoutForm />
                </div>

                {/* Order Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Cart Items */}
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4"
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
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Subtotal */}
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
                                        Calculated at next step
                                    </span>
                                </div>

                                {/* Taxes */}
                                <div className="flex justify-between">
                                    <span className="text-sm">Taxes</span>
                                    <span className="text-sm font-medium">
                                        Calculated at next step
                                    </span>
                                </div>

                                <Separator />

                                {/* Total */}
                                <div className="flex justify-between">
                                    <span className="text-base font-bold">
                                        Estimated Total
                                    </span>
                                    <span className="text-base font-bold">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Secure checkout message */}
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                                    <ShoppingBag className="h-4 w-4" />
                                    <span>
                                        Secure checkout powered by Stripe
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
