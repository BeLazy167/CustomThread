import Order from '../models/order.model';
import { AppError } from '../middleware/error.middleware';

// Interface to type the populated Design document
interface DesignDocument {
    _id: string;
    designDetail?: {
        title?: string;
        price?: number;
        description?: string;
        tags?: string[];
    };
    image?: string;
}

export class OrderService {
    // Get all orders for a specific user
    static async getUserOrders(userId: string, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            // Query by user field as per the schema and populate design details
            const orders = await Order.find({ user: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'items.designId',
                    model: 'Design',
                    select: 'designDetail image',
                })
                .lean()
                .exec();

            // Format the response for frontend consumption
            const formattedOrders = orders.map((order) => {
                return {
                    ...order,
                    items: order.items.map((item) => {
                        // Cast designId to DesignDocument
                        const design = item.designId as unknown as DesignDocument;

                        return {
                            ...item,
                            design: design
                                ? {
                                      _id: design._id,
                                      title: design.designDetail?.title || 'Unknown Design',
                                      price: item.price || design.designDetail?.price || 0,
                                      images: design.image ? [design.image] : [],
                                  }
                                : {
                                      _id: item.designId?.toString() || 'unknown',
                                      title: 'Unknown Design',
                                      price: item.price || 0,
                                      images: [],
                                  },
                            color: item.customizations?.color || 'Default',
                        };
                    }),
                };
            });

            const total = await Order.countDocuments({ user: userId });

            return {
                orders: formattedOrders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error: any) {
            throw new AppError(`Error fetching user orders: ${error.message}`, 500);
        }
    }

    // Cancel an order (only if status is 'pending')
    static async cancelOrder(orderId: string, userId: string) {
        try {
            const order = await Order.findOne({ _id: orderId, user: userId });

            if (!order) {
                throw new AppError('Order not found or does not belong to user', 404);
            }

            if (order.status !== 'pending') {
                throw new AppError(
                    `Cannot cancel order with status '${order.status}'. Only pending orders can be cancelled.`,
                    400
                );
            }

            order.status = 'cancelled';
            await order.save();

            return order;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Error cancelling order: ${error.message}`, 500);
        }
    }

    // Get all orders (for test purposes only)
    static async getAllOrders(page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;

            // Query all orders with pagination
            const orders = await Order.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'items.designId',
                    model: 'Design',
                    select: 'designDetail image',
                })
                .lean()
                .exec();

            // Format the response for frontend consumption
            const formattedOrders = orders.map((order) => {
                return {
                    ...order,
                    items: order.items.map((item) => {
                        // Cast designId to DesignDocument
                        const design = item.designId as unknown as DesignDocument;

                        return {
                            ...item,
                            design: design
                                ? {
                                      _id: design._id,
                                      title: design.designDetail?.title || 'Unknown Design',
                                      price: item.price || design.designDetail?.price || 0,
                                      images: design.image ? [design.image] : [],
                                  }
                                : {
                                      _id: item.designId?.toString() || 'unknown',
                                      title: 'Unknown Design',
                                      price: item.price || 0,
                                      images: [],
                                  },
                            color: item.customizations?.color || 'Default',
                        };
                    }),
                };
            });

            const total = await Order.countDocuments({});

            return {
                orders: formattedOrders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error: any) {
            throw new AppError(`Error fetching all orders: ${error.message}`, 500);
        }
    }
}
