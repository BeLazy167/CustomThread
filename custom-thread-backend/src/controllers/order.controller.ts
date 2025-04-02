import { Request, Response } from 'express';
import Stripe from 'stripe';
import { appConfig } from '../config/app.config';
import { logger } from '../config/logger';
import { AppError } from '../middleware/error.middleware';

if (!appConfig.stripe.secretKey) {
    throw new Error('Stripe secret key is not configured');
}

if (!appConfig.stripe.webhookSecret) {
    throw new Error('Stripe webhook secret is not configured');
}

const stripe = new Stripe(appConfig.stripe.secretKey, {
    apiVersion: '2025-02-24.acacia',
});

export const stripeWebhookHandler = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        throw new AppError('No Stripe signature found', 400);
    }

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            appConfig.stripe.webhookSecret!
        );

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                logger.info('Payment succeeded:', paymentIntent.id);
                // Handle successful payment
                break;
            }

            case 'payment_intent.payment_failed': {
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                logger.error('Payment failed:', failedPayment.id);
                // Handle failed payment
                break;
            }

            default:
                logger.info(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        logger.error('Stripe webhook error:', err);
        throw new AppError('Webhook signature verification failed', 400);
    }
};
