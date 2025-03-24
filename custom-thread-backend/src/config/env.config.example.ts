/**
 * Example Environment Configuration
 *
 * This file serves as documentation for the environment variables used
 * in the application. Copy this file to env.config.ts and fill in your
 * actual values.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const env = {
    // Server configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),

    // Database - replace with your actual MongoDB connection string
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/custom-thread',

    // CORS - replace with your frontend URL
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Cloudinary - fill in your Cloudinary credentials
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'your-api-key',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',

    // Clerk - fill in your Clerk credentials
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'your-clerk-secret-key',
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || 'your-clerk-publishable-key',

    // Stripe - fill in your Stripe credentials
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your-stripe-secret-key',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'your-stripe-publishable-key',
    WEBHOOK_ENDPOINT_SECRET: process.env.WEBHOOK_ENDPOINT_SECRET || 'your-webhook-secret',
} as const;
