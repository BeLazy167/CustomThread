import { Cloudinary } from "@cloudinary/url-gen";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const cloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_CLOUD_NAME,
    },
});

export async function uploadToCloudinary(file: File | string) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "temp123");

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Cloudinary API error:", errorData);
            throw new Error(
                errorData.error?.message ||
                    "Failed to upload image to Cloudinary"
            );
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}
