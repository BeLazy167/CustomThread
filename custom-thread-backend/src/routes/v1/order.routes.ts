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
import { Request, Response } from 'express';

const router = express.Router();

// Public route for Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes - require authentication
router.get('/', authenticate, getOrders);
router.get('/:orderId', authenticate, getOrderById);
router.post(
    '/checkout',
    authenticate,
    createCheckoutSession as (req: Request, res: Response) => Promise<Response>
);

// Admin routes
router.patch('/:orderId/status', authenticate, isAdmin, updateOrderStatus);

export default router;
