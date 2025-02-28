import { create } from "zustand";
import { createDesignSlice, DesignSlice } from "./slices/design-slice";
import { createCartSlice, CartSlice } from "./slices/cart-slice";

type Store = DesignSlice & CartSlice;

export const useStore = create<Store>()((...args) => ({
    ...createDesignSlice(...args),
    ...createCartSlice(...args),
}));

// Utility hook for better type inference
export const useDesignDetails = () => {
    const store = useStore();
    return {
        details: store.details,
        setDetails: store.setDetails,
        validateDetails: store.validateDetails,
        validationErrors: store.validationErrors,
        resetDetails: store.resetDetails,
    };
};

// Utility hook for cart
export const useCartStore = () => {
    const store = useStore();
    return {
        items: store.items,
        total: store.total,
        isLoading: store.isLoading,
        error: store.error,
        addItem: store.addItem,
        updateItemQuantity: store.updateItemQuantity,
        removeItem: store.removeItem,
        clearCart: store.clearCart,
        setIsLoading: store.setIsLoading,
        setError: store.setError,
    };
};
