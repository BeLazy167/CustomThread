import { StateCreator } from "zustand";
import { z } from "zod";

// Schema
export const designDetailsSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    tags: z.array(z.string().min(1).max(30)).max(10, "Maximum 10 tags allowed"),
    status: z.enum(["draft", "submitting", "submitted"]).default("draft"),
    lastSaved: z.number().optional(),
});

export type DesignDetails = z.infer<typeof designDetailsSchema>;

export interface DesignSlice {
    // Design Details State
    details: DesignDetails;
    validationErrors: z.ZodError | null;
    isSubmitting: boolean;

    // Actions
    setDetails: (details: Partial<DesignDetails>) => void;
    validateDetails: () => boolean;
    resetDetails: () => void;
    saveDetails: () => void;
    setSubmitting: (isSubmitting: boolean) => void;
}

const initialDetails: DesignDetails = {
    title: "",
    description: "",
    tags: [],
    status: "draft",
};

export const createDesignSlice: StateCreator<DesignSlice> = (set, get) => ({
    // Initial Design Details State
    details: initialDetails,
    validationErrors: null,
    isSubmitting: false,

    // Design Details Actions
    setDetails: (newDetails) => {
        set((state) => ({
            details: {
                ...state.details,
                ...newDetails,
            },
        }));
    },

    validateDetails: () => {
        try {
            designDetailsSchema.parse(get().details);
            set({ validationErrors: null });
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                set({ validationErrors: error });
            }
            return false;
        }
    },

    resetDetails: () => {
        set({
            details: initialDetails,
            validationErrors: null,
        });
    },

    saveDetails: () => {
        set((state) => ({
            details: {
                ...state.details,
                lastSaved: Date.now(),
            },
        }));
    },

    setSubmitting: (isSubmitting) => {
        set({ isSubmitting });
        if (isSubmitting) {
            set((state) => ({
                details: { ...state.details, status: "submitting" },
            }));
        }
    },
});
