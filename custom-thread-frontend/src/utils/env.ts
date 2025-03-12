/**
 * Environment variables utility
 *
 * This file provides a consistent way to access environment variables
 * in both development and production environments.
 */

// Define the window.ENV interface for TypeScript
declare global {
    interface Window {
        ENV?: {
            VITE_API_URL: string;
            VITE_ENVIRONMENT: string;
            VITE_CLOUDINARY_CLOUD_NAME: string;
            VITE_CLOUDINARY_API_KEY: string;
            VITE_CLERK_PUBLISHABLE_KEY: string;
            VITE_STRIPE_PUBLISHABLE_KEY: string;
        };
    }
}

/**
 * Get an environment variable
 *
 * In development, this will use the Vite import.meta.env
 * In production, it will use the window.ENV object that's injected at runtime
 *
 * @param key The environment variable key
 * @param fallback Optional fallback value
 * @returns The environment variable value or fallback
 */
export function getEnv(key: string, fallback: string = ""): string {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
        // In production, use the runtime-injected window.ENV
        if (window.ENV && key in window.ENV) {
            return window.ENV[key as keyof typeof window.ENV] || fallback;
        }
    }

    // In development or if window.ENV doesn't have the key, use Vite's import.meta.env
    return import.meta.env[key] || fallback;
}

/**
 * Environment variables
 */
export const env = {
    // API URL
    apiUrl: getEnv("VITE_API_URL", "http://localhost:3001"),

    // Environment (development, qa, production)
    environment: getEnv("VITE_ENVIRONMENT", "development"),

    // Cloudinary
    cloudinary: {
        cloudName: getEnv("VITE_CLOUDINARY_CLOUD_NAME"),
        apiKey: getEnv("VITE_CLOUDINARY_API_KEY"),
    },

    // Authentication
    clerk: {
        publishableKey: getEnv("VITE_CLERK_PUBLISHABLE_KEY"),
    },

    // Stripe
    stripe: {
        publishableKey: getEnv("VITE_STRIPE_PUBLISHABLE_KEY"),
    },

    // Helper methods
    isDevelopment: () => env.environment === "development",
    isQA: () => env.environment === "qa",
    isProduction: () => env.environment === "production",
};

export default env;
