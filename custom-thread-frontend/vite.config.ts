import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    assetsInclude: ["**/*.obj"],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        host: true, // Listen on all addresses
        open: true,
        cors: true,
    },
    build: {
        outDir: "dist",
        sourcemap: process.env.NODE_ENV !== "production",
        minify: "esbuild",
        assetsInlineLimit: 0, // Disable inlining assets
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    preview: {
        port: 3000,
        host: true,
    },
    publicDir: "public", // Explicitly set the public directory
});
