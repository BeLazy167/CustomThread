import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

interface SubmitDesignPayload {
    userId: string;
    designDetails: {
        title: string;
        description?: string;
        tags: string[];
    };
    imageData: string; // Base64 encoded image
}

async function submitDesign(payload: SubmitDesignPayload) {
    const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to submit design");
    }

    return response.json();
}

export function useSubmitDesign() {
    const { userId } = useAuth();
    const { details, setSubmitting } = useStore();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (imageData: string) => {
            if (!userId) throw new Error("User not authenticated");

            const payload: SubmitDesignPayload = {
                userId,
                designDetails: {
                    title: details.title,
                    description: details.description,
                    tags: details.tags,
                },
                imageData,
            };

            return submitDesign(payload);
        },
        onMutate: () => {
            setSubmitting(true);
            toast({
                title: "Submitting Design",
                description: "Please wait while we process your submission...",
            });
        },
        onSuccess: () => {
            toast({
                title: "Success!",
                description: "Your design has been submitted successfully.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to submit design",
                variant: "destructive",
            });
        },
        onSettled: () => {
            setSubmitting(false);
        },
    });
}
