import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { AppError } from './error.middleware';

// Add user data to request object
export interface AuthRequest extends Request {
    auth?: {
        userId: string;
        sessionId: string;
        getToken: () => Promise<string | null>;
    };
}

export const verifyAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Get the session token from the request headers
        const { authorization } = req.headers;

        if (!authorization) {
            throw new AppError('Unauthorized - No token provided', 401);
        }

        // Extract the token from the header (Bearer token format)
        const token = authorization.replace('Bearer ', '');

        if (!token) {
            throw new AppError('Unauthorized - Invalid token format', 401);
        }

        // Development-only code: Accept a test token
        // IMPORTANT: Remove this in production!
        if (
            (token === 'test_development_token' || token === 'admin_access_token') &&
            process.env.NODE_ENV !== 'production'
        ) {
            // Mock user for development
            req.auth = {
                userId:
                    token === 'admin_access_token'
                        ? process.env.ADMIN_USER_ID || 'admin_user_123'
                        : 'dev_user_123',
                sessionId: 'test_session_id',
                getToken: () => Promise.resolve(token),
            };
            return next();
        }

        try {
            const { sub, sid } = await clerkClient.verifyToken(token);

            // Attach user info to the request
            req.auth = {
                userId: sub,
                sessionId: sid,
                getToken: () => Promise.resolve(token),
            };

            next();
        } catch (error) {
            throw new AppError('Unauthorized - Invalid token', 401);
        }
    } catch (error) {
        next(error);
    }
};
