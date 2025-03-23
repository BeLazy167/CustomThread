import { useMutation } from "@tanstack/react-query";
import { state } from "@/components/design/store";
import { useStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@clerk/clerk-react";

interface DesignDetail {
    title: string;
    description: string;
    tags: string[];
    color: string;
    price: number;
}

interface DesignSubmission {
    userName: string;
    userId: string;
    designDetail: DesignDetail;
    image: string;
    decal?: string;
}
import { designApi } from "@/services/api";
const submitDesign = async (data: DesignSubmission) => {
    const response = await designApi.createDesign(data);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit design");
    }

    return response.json();
};

export const useSubmitDesign = () => {
    const { details } = useStore();
    const { toast } = useToast();
    const { userId } = useAuth();

    return useMutation({
        mutationFn: async ({
            imageData,
            username,
        }: {
            imageData: string;
            username: string;
        }) => {
            if (!userId) {
                throw new Error("User not authenticated");
            }

            if (!details.title) {
                throw new Error("Title is required");
            }

            if (!details.tags || details.tags.length === 0) {
                throw new Error("At least one tag is required");
            }

            try {
                // Upload the canvas image to Cloudinary
                const imageUrl = await uploadToCloudinary(imageData);

                // If we have a logo, ensure it's uploaded to Cloudinary as well
                let decalUrl = null;
                if (state.logoDecal && state.logoDecal.startsWith("data:")) {
                    decalUrl = await uploadToCloudinary(state.logoDecal);
                } else if (
                    state.logoDecal &&
                    state.logoDecal.startsWith("blob:")
                ) {
                    // Convert blob URL to File object
                    const response = await fetch(state.logoDecal);
                    const blob = await response.blob();
                    const file = new File([blob], "logo.png", {
                        type: "image/png",
                    });
                    decalUrl = await uploadToCloudinary(file);
                } else if (state.logoDecal) {
                    // If it's already a URL, use it directly
                    decalUrl = state.logoDecal;
                }

                const designData: DesignSubmission = {
                    userId,
                    userName: username,
                    designDetail: {
                        title: details.title,
                        description: details.description || "",
                        tags: details.tags,
                        color: `#${state.color.getHexString()}`,
                        price: 29.99, // Default price, can be made configurable
                    },
                    image: imageUrl,
                    ...(decalUrl && { decal: decalUrl }),
                };

                return submitDesign(designData);
            } catch (error) {
                console.error("Upload error:", error);
                throw new Error(
                    error instanceof Error
                        ? error.message
                        : "Failed to upload images"
                );
            }
        },
        onMutate: () => {
            toast({
                title: "Uploading Design",
                description: "Please wait while we process your images...",
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
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to submit design",
                variant: "destructive",
            });
        },
    });
};
