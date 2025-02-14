import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createDesignSlice, DesignSlice } from "./slices/design-slice";

export const useStore = create<DesignSlice>()(
    persist(
        (...a) => ({
            ...createDesignSlice(...a),
        }),
        {
            name: "custom-thread-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist design-related fields
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
        validationErrors: store.validationErrors,
        setDetails: store.setDetails,
        validateDetails: store.validateDetails,
        resetDetails: store.resetDetails,
    };
};
