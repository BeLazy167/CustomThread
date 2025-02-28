import { useCartStore } from "@/store";
import { toast } from "sonner";

// Hook for getting cart data
export function useCart() {
    const { items, total, isLoading, error } = useCartStore();

    return {
        data: { items, total },
        isLoading,
        isError: !!error,
        error,
    };
}

// Hook for adding items to cart
export function useAddToCart() {
    const { addItem, setIsLoading, setError, isLoading, error } =
        useCartStore();

    const mutate = async (cartItem: any) => {
        try {
            setIsLoading(true);
            setError(null);

            // Add item to cart
            addItem({
                productId: cartItem.productId,
                name: cartItem.name,
                price: cartItem.price,
                image: cartItem.image,
                size: cartItem.size,
                quantity: cartItem.quantity || 1,
                isCustomDesign: cartItem.isCustomDesign || false,
            });

            // Show success toast
            toast.success("Added to cart", {
                description: `${cartItem.name} (${cartItem.size}) has been added to your cart.`,
            });

            return { success: true };
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to add item to cart";

            setError(errorMessage);

            // Show error toast
            toast.error("Failed to add to cart", {
                description: errorMessage,
            });

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mutate,
        isPending: isLoading,
        isError: !!error,
        error,
    };
}

// Hook for updating cart item quantity
export function useUpdateCartItem() {
    const { updateItemQuantity, setIsLoading, setError, isLoading, error } =
        useCartStore();

    const mutate = async ({
        itemId,
        quantity,
    }: {
        itemId: string;
        quantity: number;
    }) => {
        try {
            setIsLoading(true);
            setError(null);

            // Update item quantity
            updateItemQuantity(itemId, quantity);

            return { success: true };
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update cart item";

            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mutate,
        isPending: isLoading,
        isError: !!error,
        error,
    };
}

// Hook for removing items from cart
export function useRemoveFromCart() {
    const { removeItem, setIsLoading, setError, isLoading, error } =
        useCartStore();

    const mutate = async (itemId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Remove item from cart
            removeItem(itemId);

            // Show success toast
            toast.success("Item removed", {
                description: "Item has been removed from your cart.",
            });

            return { success: true };
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to remove item from cart";

            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mutate,
        isPending: isLoading,
        isError: !!error,
        error,
    };
}

// Hook for clearing cart
export function useClearCart() {
    const { clearCart, setIsLoading, setError, isLoading, error } =
        useCartStore();

    const mutate = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Clear cart
            clearCart();

            // Show success toast
            toast.success("Cart cleared", {
                description: "Your cart has been cleared.",
            });

            return { success: true };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to clear cart";

            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mutate,
        isPending: isLoading,
        isError: !!error,
        error,
    };
}
