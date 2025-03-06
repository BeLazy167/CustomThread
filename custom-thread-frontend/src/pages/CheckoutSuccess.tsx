import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";
import LivePackageJourney from "@/components/checkout/CheckoutPage";

export default function CheckoutSuccess() {
    const navigate = useNavigate();
    const { clearCart } = useCartStore();

    // Clear the cart when the success page loads
    useEffect(() => {
        // Clear the cart
        clearCart();

        // Remove the pending checkout from session storage
        sessionStorage.removeItem("pendingCheckout");

        // You could also fetch the order details using the session_id from the URL query params
        // const params = new URLSearchParams(window.location.search);
        // const sessionId = params.get('session_id');
        // if (sessionId) {
        //   // Fetch order details using the session ID
        // }
    }, [clearCart]);

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="max-w-2xl mx-auto">
                <Card className="border-green-500 shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <CardTitle className="text-2xl font-bold">
                            Payment Successful!
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Thank you for your purchase. Your order has been
                            confirmed and is now being processed.
                        </p>

                        <div className="bg-muted p-4 rounded-md">
                            <h3 className="font-medium mb-2">
                                What happens next?
                            </h3>
                            <ul className="text-sm text-left space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">
                                        1.
                                    </span>
                                    <span>
                                        You'll receive an order confirmation
                                        email with your order details.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">
                                        2.
                                    </span>
                                    <span>
                                        Our team will prepare your custom items
                                        for production.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">
                                        3.
                                    </span>
                                    <span>
                                        Once shipped, you'll receive tracking
                                        information via email.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">
                                        4.
                                    </span>
                                    <span>
                                        Your amazing custom threads will arrive
                                        at your doorstep!
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-2">
                        <Button
                            onClick={() => navigate("/products")}
                            className="w-full"
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Button>
                    </CardFooter>
                </Card>

                {/* Package Journey Animation */}
                <div className="mt-8">
                    <LivePackageJourney />
                </div>
            </div>
        </div>
    );
}
