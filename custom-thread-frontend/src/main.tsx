import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// const PUBLISHABLE_KEY = "pk_test_YXdhaXRlZC1mZWxpbmUtMjcuY2xlcmsuYWNjb3VudHMuZGV2JA"

// Add polyfill for crypto.randomUUID
if (!crypto.randomUUID) {
    // Use type assertion to match the expected UUID template type
    (crypto as any).randomUUID = function (): string {
        return "10000000-1000-4000-8000-100000000000".replace(
            /[018]/g,
            (c: string) => {
                const num = Number(c);
                return (
                    num ^
                    (crypto.getRandomValues(new Uint8Array(1))[0] &
                        (15 >> (num / 4)))
                ).toString(16);
            }
        );
    };
}

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <App />
            </ClerkProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
