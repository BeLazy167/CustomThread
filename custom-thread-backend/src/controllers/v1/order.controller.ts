import type { Request, Response } from 'express';
import Order from '../../models/order.model';
import Stripe from 'stripe';
import { DesignModel, DesignDocument } from '../../models/design.model';
import { AuthRequest } from '../../middleware/auth';
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Rename to _CheckoutSessionRequest to avoid unused variable warning
type _CheckoutSessionRequest = {
    items: {
        designId: string;
        quantity: number;
        size: string;
        customizations?: {
            color?: string;
            text?: string;
            placement?: string;
        };
    }[];
    shippingDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
        contact: string;
        country: string;
        postalCode: string;
    };
};

// Rename to _DesignDoc to avoid unused variable warning
interface _DesignDoc {
    _id: { toString(): string };
    designDetail: {
        title: string;
        description?: string;
        tags: string[];
        color: string;
        price: number;
    };
    image: string;
    decal?: string;
}

/**
 * Get all orders for the authenticated userId
 */
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ userId: req.auth?.userId }).populate({
            path: 'items.designId',
            model: 'Design',
        });

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            userId: req.auth?.userId,
        }).populate({
            path: 'items.designId',
            model: 'Design',
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Create a Stripe checkout session for custom design order
 */
export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
    try {
        // Validate request body
        if (!req.body.items || !req.body.shippingDetails) {
            return res.status(400).json({
                success: false,
                message: 'Items and shipping details are required',
            });
        }

        // Validate cart items and fetch design details
        const { items, shippingDetails } = req.body;
        const designIds = items.map((item: any) => item.designId);

        const designs = await DesignModel.find({ _id: { $in: designIds } });

        if (designs.length !== designIds.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more designs not found',
            });
        }

        // Prepare order items with design information
        const orderItems = items.map((item: any) => {
            const design = designs.find(
                (d: any) => d._id.toString() === item.designId
            ) as DesignDocument;
            return {
                designId: design?._id,
                quantity: item.quantity,
                size: item.size,
                price: design?.designDetail?.price || 0,
                customizations: item.customizations || {},
            };
        });

        // Calculate total amount
        const totalAmount = orderItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        // Check if user is authenticated
        if (!req.auth) {
            throw new Error('User not authenticated');
        }

        // Create order in pending state
        const order = await Order.create({
            user: req.auth.userId,
            items: orderItems,
            shippingDetails,
            totalAmount,
            status: 'pending',
        });

        // Prepare line items for Stripe
        const lineItems = orderItems.map((item: any) => {
            const design = designs.find(
                (d: any) => d._id.toString() === item.designId.toString()
            ) as DesignDocument;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: design?.designDetail?.title || 'Custom Design',
                        description: design?.designDetail?.description || '',
                        images: design?.image ? [design.image] : [],
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to cents
                },
                quantity: item.quantity,
            };
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url:
                process.env.STRIPE_SUCCESS_URL ||
                'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
            metadata: {
                orderId: (order as any)._id.toString(),
            },
        });

        if (!session.url) {
            return res.status(400).json({
                success: false,
                message: 'Failed to create checkout session',
            });
        }

        return res.status(200).json({
            success: true,
            url: session.url,
            sessionId: session.id,
        });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'An error occurred during checkout',
        });
    }
};

/**
 * Handle Stripe webhook events
 */
export const stripeWebhook = async (req: Request, res: Response) => {
    let event;
    try {
        const signature = req.headers['stripe-signature'];
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

        event = stripe.webhooks.constructEvent(payloadString, signature as string, secret);
    } catch (error: any) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle checkout session completed event
    if (event.type === 'checkout.session.completed') {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;

            if (!orderId) {
                return res.status(400).json({ message: 'Order ID not found in session metadata' });
            }

            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Update order with final amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }

            order.status = 'confirmed';
            order.paymentId = session.payment_intent as string;
            order.updatedAt = new Date();

            await order.save();

            // You could add additional logic here like sending confirmation emails
        } catch (error) {
            console.error('Error handling checkout completion:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Handle payment intent succeeded event
    if (event.type === 'payment_intent.succeeded') {
        // Additional payment success handling if needed
    }

    // Handle payment intent failed event
    if (event.type === 'payment_intent.payment_failed') {
        try {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const order = await Order.findOne({ paymentId: paymentIntent.id });

            if (order) {
                order.status = 'payment_failed';
                order.updatedAt = new Date();
                await order.save();
            }
        } catch (error) {
            console.error('Error handling payment failure:', error);
        }
    }

    res.status(200).send();
};

/**
 * Update order status (for admin use)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = status;
        order.updatedAt = new Date();
        await order.save();

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
