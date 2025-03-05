import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// Extended request interface with auth property
interface AuthRequest extends Request {
    auth?: {
        userId: string;
        [key: string]: any;
    };
}

/**
 * Middleware to check if the authenticated user is an admin
 */
export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Check if user is authenticated
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Get admin user ID from environment variable
        const adminUserId = process.env.ADMIN_USER_ID;

        // Check if the authenticated user is an admin
        if (req.auth.userId === adminUserId) {
            return next();
        }

        // If not admin, return forbidden
        logger.warn('Unauthorized admin access attempt', {
            userId: req.auth.userId,
            path: req.path,
            method: req.method,
        });

        return res.status(403).json({ message: 'Admin access required' });
    } catch (error) {
        logger.error('Error in admin authorization', { error });
        return res.status(500).json({ message: 'Internal server error' });
    }
};
