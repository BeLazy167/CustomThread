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
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: process.env.NODE_ENV === "production",
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                },
            },
        },
    },
    preview: {
        port: 3000,
        host: true,
    },
});
