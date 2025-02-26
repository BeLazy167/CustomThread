import { clerkMiddleware } from '@clerk/express';
import { Request } from 'express';

// Ensure Clerk is properly initialized with both keys
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
    throw new Error('Clerk keys are not properly configured');
}

declare module 'express' {
    interface Request {
        auth?: {
            userId: string;
            sessionId: string;
        };
    }
}

export type AuthRequest = Request & {
    auth: {
        userId: string;
        sessionId: string;
    };
};

export const authenticate = clerkMiddleware();
