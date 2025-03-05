import type { Request, Response } from 'express';
import Order from '../../models/order.model';
import Stripe from 'stripe';
import { DesignModel } from '../../models/design.model';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type CheckoutSessionRequest = {
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
export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;

        // Validate cart items and fetch design details
        const designIds = checkoutSessionRequest.items.map((item) => item.designId);
        const designs = await DesignModel.find({ _id: { $in: designIds } });

        if (designs.length !== designIds.length) {
            return res.status(404).json({
                success: false,
                message: 'One or more designs not found.',
            });
        }

        // Prepare order items with design information
        const orderItems = checkoutSessionRequest.items.map((item) => {
            const design = designs.find((d) => d._id.toString() === item.designId);
            if (!design) {
                throw new Error(`Design with ID ${item.designId} not found`);
            }

            return {
                designId: design._id,
                quantity: item.quantity,
                size: item.size,
                price: design.designDetail.price,
                customizations: item.customizations || {},
            };
        });

        // Calculate total amount
        const totalAmount = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        if (!req.auth?.userId) {
            throw new Error('User not authenticated');
        }

        // Create order in pending state
        const order = await Order.create({
            userId: req.auth.userId,
            items: orderItems,
            shippingDetails: checkoutSessionRequest.shippingDetails,
            status: 'pending',
            totalAmount: Math.round(totalAmount * 100), // Store in cents
            createdAt: new Date(),
        });

        // Create line items for Stripe
        const lineItems = createLineItems(checkoutSessionRequest.items, designs);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA', 'AU'],
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order.id,
                userId: req.auth.userId,
            },
        });

        if (!session.url) {
            return res.status(400).json({
                success: false,
                message: 'Error while creating checkout session',
            });
        }

        return res.status(200).json({
            success: true,
            session,
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal Server Error',
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

/**
 * Helper function to create line items for Stripe checkout
 */
const createLineItems = (items: CheckoutSessionRequest['items'], designs: any[]) => {
    return items.map((item) => {
        const design = designs.find((d) => d._id.toString() === item.designId);

        if (!design) throw new Error(`Design with ID ${item.designId} not found`);

        // Create description including size and customizations
        let description = `Size: ${item.size}`;

        if (item.customizations?.color) {
            description += `, Color: ${item.customizations.color}`;
        } else {
            description += `, Color: ${design.designDetail.color}`;
        }

        if (item.customizations?.text) {
            description += `, Custom Text: ${item.customizations.text}`;
        }

        if (item.customizations?.placement) {
            description += `, Placement: ${item.customizations.placement}`;
        }

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: design.designDetail.title,
                    description: description,
                    images: [design.image],
                    metadata: {
                        designId: design._id.toString(),
                        decal: design.decal || '',
                    },
                },
                unit_amount: Math.round(design.designDetail.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        };
    });
};
