import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createDesignSlice, DesignSlice } from "./slices/design-slice";
import { createCartSlice, CartSlice } from "./slices/cart-slice";

type Store = DesignSlice & CartSlice;

export const useStore = create<Store>()(
    persist(
        (...args) => ({
            ...createDesignSlice(...args),
            ...createCartSlice(...args),
        }),
        {
            name: "custom-thread-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items,
                total: state.total,
                details: state.details,
            }),
        }
    )
);

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
