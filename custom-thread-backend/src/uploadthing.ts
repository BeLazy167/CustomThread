import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            // Optional middleware code
            return { uploadedBy: "user" };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for:");
            return { metadata };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
