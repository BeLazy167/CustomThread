import { create } from "zustand";
import { createDesignSlice, DesignSlice } from "./slices/design-slice";

type Store = DesignSlice;

export const useStore = create<Store>()((...args) => ({
    ...createDesignSlice(...args),
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
