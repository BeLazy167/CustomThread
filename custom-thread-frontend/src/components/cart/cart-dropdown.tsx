import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, X, Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store";
import { useRemoveFromCart } from "@/hooks/use-cart";

export function CartDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { items, total, isLoading } = useCartStore();
    const removeFromCart = useRemoveFromCart();

    const itemCount = items.length;

    const handleRemoveItem = (itemId: string) => {
        removeFromCart.mutate(itemId);
    };

    const handleCheckout = () => {
        setIsOpen(false);
        navigate("/checkout");
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {itemCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[70vh]">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">
                            Your cart is empty
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                            Add items to your cart to see them here
                        </p>
                        <Button
                            onClick={() => {
                                setIsOpen(false);
                                navigate("/products");
                            }}
                        >
                            Browse Products
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mt-4 max-h-[60vh] overflow-auto pr-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-4"
                                >
                                    <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
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
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            handleRemoveItem(item.id)
                                        }
                                        disabled={removeFromCart.isPending}
                                    >
                                        {removeFromCart.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <X className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                            <div className="flex justify-between mb-4">
                                <span className="text-sm font-medium">
                                    Total
                                </span>
                                <span className="text-sm font-bold">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate("/checkout");
                                    }}
                                >
                                    View Cart
                                </Button>
                                <Button onClick={handleCheckout}>
                                    Checkout
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
