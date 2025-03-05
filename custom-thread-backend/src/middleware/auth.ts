import { clerkMiddleware } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';

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

// Development authentication middleware for testing
const developmentAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader === 'Bearer development_token') {
        // Set mock auth data for development
        req.auth = {
            userId: 'dev_user_123',
            sessionId: 'dev_session_123',
        };
        return next();
    }

    // If not using development token, proceed to Clerk middleware
    return clerkMiddleware()(req, res, next);
};

// Use development auth in development, Clerk auth in production
export const authenticate =
    process.env.NODE_ENV === 'production' ? clerkMiddleware() : developmentAuth;
