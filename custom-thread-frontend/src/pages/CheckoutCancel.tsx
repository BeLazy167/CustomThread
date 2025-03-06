import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store";

export default function CheckoutCancel() {
    const navigate = useNavigate();
    const { items } = useCartStore();

    // Check if we need to recover cart items from session storage
    useEffect(() => {
        // If the cart is empty but we have pending checkout data, we could recover it
        // This is optional and depends on your UX preferences
        if (items.length === 0) {
            const pendingCheckout = sessionStorage.getItem("pendingCheckout");
            if (pendingCheckout) {
                // You could implement recovery logic here if needed
                // For now, we'll just keep the sessionStorage item for reference
                console.log("Found pending checkout that could be recovered");
            }
        }
    }, [items.length]);

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="max-w-md mx-auto">
                <Card className="border-amber-500 shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                        <CardTitle className="text-2xl font-bold">
                            Payment Cancelled
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Your payment was cancelled and no charges were made.
                            Your items are still in your cart if you'd like to
                            complete your purchase.
                        </p>

                        <div className="bg-muted p-4 rounded-md">
                            <h3 className="font-medium mb-2">
                                Common reasons for cancellation:
                            </h3>
                            <ul className="text-sm text-left space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">•</span>
                                    <span>
                                        Changed your mind about the purchase
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">•</span>
                                    <span>
                                        Needed to update payment information
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">•</span>
                                    <span>
                                        Encountered an issue during checkout
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-2">
                        <Button
                            onClick={() => navigate("/checkout")}
                            className="w-full"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Return to Checkout
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
