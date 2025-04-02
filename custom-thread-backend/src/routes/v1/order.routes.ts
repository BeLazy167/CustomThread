import express from 'express';
import {
    getOrders,
    getOrderById,
    createCheckoutSession,
    stripeWebhook,
    updateOrderStatus,
} from '../../controllers/v1/order.controller';
import { authenticate } from '../../middleware/auth';
import { isAdmin } from '../../middleware/isAdmin';
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../../services/order.service';
import { verifyAuth, AuthRequest } from '../../middleware/auth.middleware';
import { AppError } from '../../middleware/error.middleware';

const router = express.Router();

// Public route for Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Test route to get all orders - ONLY AVAILABLE IN DEVELOPMENT
router.get('/test/all-orders', async (req: Request, res: Response, next: NextFunction) => {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({
            status: 'error',
            message: 'Route not found',
        });
    }

    try {
        const page = parseInt((req.query.page as string) || '1', 10);
        const limit = parseInt((req.query.limit as string) || '20', 10);

        const results = await OrderService.getAllOrders(page, limit);
        res.json({
            ...results,
            message: 'WARNING: This is a test route only available in development',
            environment: process.env.NODE_ENV,
        });
    } catch (error) {
        next(error);
    }
});

// Protected routes - require authentication
router.get('/', authenticate, getOrders);

// Get orders for the authenticated user - MUST come before /:orderId route
router.get('/user', verifyAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Extract userId from auth object
        const userId = req.auth?.userId;

        if (!userId) {
            throw new AppError('User ID not found in auth token', 401);
        }

        const page = parseInt((req.query.page as string) || '1', 10);
        const limit = parseInt((req.query.limit as string) || '10', 10);

        const results = await OrderService.getUserOrders(userId, page, limit);
        res.json(results);
    } catch (error) {
        next(error);
    }
});

// Single order route
router.get('/:orderId', authenticate, getOrderById);

// Checkout route
router.post(
    '/checkout',
    authenticate,
    createCheckoutSession as (req: Request, res: Response) => Promise<Response>
);

// Cancel order
router.patch(
    '/:orderId/cancel',
    verifyAuth,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.auth?.userId;

            if (!userId) {
                throw new AppError('User ID not found in auth token', 401);
            }

            const { orderId } = req.params;

            if (!orderId) {
                throw new AppError('Order ID is required', 400);
            }

            const updatedOrder = await OrderService.cancelOrder(orderId, userId);
            res.json({
                message: 'Order cancelled successfully',
                order: updatedOrder,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Admin routes
router.patch('/:orderId/status', authenticate, isAdmin, updateOrderStatus);

// Test route to check auth - ONLY AVAILABLE IN DEVELOPMENT
router.get('/test/auth-check', verifyAuth, (req: AuthRequest, res: Response) => {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({
            status: 'error',
            message: 'Route not found',
        });
    }

    res.json({
        status: 'success',
        message: 'Authentication successful',
        auth: {
            userId: req.auth?.userId,
            sessionId: req.auth?.sessionId,
        },
        headers: {
            authorization: req.headers.authorization ? 'Present (hidden for security)' : 'Missing',
        },
        environment: process.env.NODE_ENV || 'development',
    });
});

export default router;
