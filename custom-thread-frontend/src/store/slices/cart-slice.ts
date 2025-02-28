import { StateCreator } from "zustand";

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
    isCustomDesign: boolean;
}

export interface CartSlice {
    items: CartItem[];
    total: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    addItem: (item: Omit<CartItem, "id">) => void;
    updateItemQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
    items: [],
    total: 0,
    isLoading: false,
    error: null,

    addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            const updatedItems = [...items];
            updatedItems[existingItemIndex].quantity += item.quantity;

            // Calculate new total
            const newTotal = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            set({
                items: updatedItems,
                total: newTotal,
            });
        } else {
            // Add new item with a unique ID
            const newItem = {
                ...item,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            };
            const newItems = [...items, newItem];

            // Calculate new total
            const newTotal = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            set({
                items: newItems,
                total: newTotal,
            });
        }
    },

    updateItemQuantity: (id, quantity) => {
        const { items } = get();
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, quantity } : item
        );

        // Calculate new total
        const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        set({
            items: updatedItems,
            total: newTotal,
        });
    },

    removeItem: (id) => {
        const { items } = get();
        const updatedItems = items.filter((item) => item.id !== id);

        // Calculate new total
        const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        set({
            items: updatedItems,
            total: newTotal,
        });
    },

    clearCart: () => {
        set({
            items: [],
            total: 0,
        });
    },

    setIsLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),
});
