import Order from '../models/order.model';
import { DesignModel } from '../models/design.model';
import { AppError } from '../middleware/error.middleware';
import mongoose from 'mongoose';
import { logger } from '../config/logger';

interface ReportFilters {
    startDate?: Date;
    endDate?: Date;
    designerId?: string;
    designId?: string;
    status?: string[];
}

interface SalesReportData {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingDesigns: Array<{
        designId: string;
        title: string;
        quantity: number;
        revenue: number;
        designer: string;
    }>;
    salesByDate: Array<{
        date: string;
        orders: number;
        revenue: number;
    }>;
    salesByDesigner: Array<{
        designerId: string;
        designerName: string;
        orders: number;
        revenue: number;
    }>;
}

// Define a more specific type for the internal aggregation
interface DesignerSalesAggregation {
    orders: number;
    revenue: number;
    designerName: string;
    processedOrderIds: { [orderId: string]: boolean }; // Add this to track processed orders
}

export class ReportService {
    /**
     * Generate a sales report with analytics
     * @param filters - Report filters (date range, designer, design)
     * @returns Sales report data
     */
    static async generateSalesReport(filters: ReportFilters): Promise<SalesReportData> {
        try {
            // Build query based on filters
            const query: any = {};

            // Date range filter
            if (filters.startDate || filters.endDate) {
                query.createdAt = {};
                if (filters.startDate) {
                    query.createdAt.$gte = filters.startDate;
                }
                if (filters.endDate) {
                    query.createdAt.$lte = filters.endDate;
                }
            }

            // Status filter - only include completed orders by default
            query.status = filters.status || ['confirmed', 'processing', 'shipped', 'delivered'];

            // Designer filter
            if (filters.designerId) {
                // We need to find all designs by this designer first
                const designerDesigns = await DesignModel.find({
                    userId: filters.designerId,
                }).select('_id');
                const designIds = designerDesigns.map((design) => design._id);

                // Then filter orders containing these designs
                query['items.designId'] = { $in: designIds };
            }

            // Specific design filter
            if (filters.designId) {
                query['items.designId'] = new mongoose.Types.ObjectId(filters.designId);
            }

            // Fetch orders with populated design data
            const orders = await Order.find(query)
                .populate({
                    path: 'items.designId',
                    model: 'Design',
                    select: 'designDetail userId userName',
                })
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            // Calculate total sales and revenue
            let totalSales = 0;
            let totalRevenue = 0;
            const designSales: Record<
                string,
                {
                    quantity: number;
                    revenue: number;
                    title: string;
                    designerId: string;
                    designerName: string;
                }
            > = {};

            const salesByDate: Record<string, { orders: number; revenue: number }> = {};
            const salesByDesigner: Record<string, DesignerSalesAggregation> = {};

            // Process each order
            orders.forEach((order) => {
                totalSales++;

                // Calculate order total from items if totalAmount is not available
                let orderTotal = 0;
                if (order.items && order.items.length > 0) {
                    orderTotal = order.items.reduce((sum, item) => {
                        return sum + item.price * item.quantity;
                    }, 0);
                } else if (order.totalAmount) {
                    orderTotal = order.totalAmount;
                }

                totalRevenue += orderTotal;

                // Format date as YYYY-MM-DD for grouping
                const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
                if (!salesByDate[orderDate]) {
                    salesByDate[orderDate] = { orders: 0, revenue: 0 };
                }
                salesByDate[orderDate].orders++;
                salesByDate[orderDate].revenue += orderTotal;

                // Process each item in the order
                order.items.forEach((item) => {
                    const design = item.designId as any;
                    if (!design) return;

                    const designId = design._id.toString();
                    const designerId = design.userId;
                    const designerName = design.userName || 'Unknown Designer';
                    const title = design.designDetail?.title || 'Unknown Design';
                    const itemRevenue = item.price * item.quantity;

                    // Aggregate sales by design
                    if (!designSales[designId]) {
                        designSales[designId] = {
                            quantity: 0,
                            revenue: 0,
                            title,
                            designerId,
                            designerName,
                        };
                    }
                    designSales[designId].quantity += item.quantity;
                    designSales[designId].revenue += itemRevenue;

                    // Aggregate sales by designer
                    if (!designerId) return;

                    if (!salesByDesigner[designerId]) {
                        salesByDesigner[designerId] = {
                            orders: 0,
                            revenue: 0,
                            designerName,
                            processedOrderIds: {},
                        };
                    }
                    salesByDesigner[designerId].revenue += itemRevenue;
                    // Only count unique orders per designer
                    const orderIdStr = order._id.toString();
                    if (!salesByDesigner[designerId].processedOrderIds[orderIdStr]) {
                        salesByDesigner[designerId].orders++;
                        salesByDesigner[designerId].processedOrderIds[orderIdStr] = true;
                    }
                });
            });

            // Calculate average order value
            const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

            // Get top selling designs
            const topSellingDesigns = Object.entries(designSales)
                .map(([designId, data]) => ({
                    designId,
                    title: data.title,
                    quantity: data.quantity,
                    revenue: data.revenue,
                    designer: data.designerName,
                }))
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 10);

            // Format sales by date for the report
            const salesByDateArray = Object.entries(salesByDate)
                .map(([date, data]) => ({
                    date,
                    orders: data.orders,
                    revenue: data.revenue,
                }))
                .sort((a, b) => a.date.localeCompare(b.date));

            // Format sales by designer for the report
            const salesByDesignerArray = Object.entries(salesByDesigner)
                .map(([designerId, data]) => ({
                    designerId,
                    designerName: data.designerName,
                    orders: data.orders,
                    revenue: data.revenue,
                }))
                .sort((a, b) => b.revenue - a.revenue);

            return {
                totalSales,
                totalRevenue,
                averageOrderValue,
                topSellingDesigns,
                salesByDate: salesByDateArray,
                salesByDesigner: salesByDesignerArray,
            };
        } catch (error) {
            logger.error('Error generating sales report:', { error });
            throw new AppError(
                `Failed to generate sales report: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    /**
     * Generate a designer performance report
     * @param designerId - Designer ID to generate report for
     * @param filters - Additional filters like date range
     * @returns Designer performance data
     */
    static async generateDesignerReport(designerId: string, filters: ReportFilters) {
        try {
            // Merge designer ID with filters
            const reportFilters = { ...filters, designerId };

            // Get sales report data filtered for this designer
            const salesData = await this.generateSalesReport(reportFilters);

            // Get all designs by this designer
            const designs = await DesignModel.find({ userId: designerId }).lean().exec();

            // Calculate additional designer-specific metrics
            const totalDesigns = designs.length;
            const activeDesigns = salesData.topSellingDesigns.length;
            const inactiveDesigns = totalDesigns - activeDesigns;

            // Calculate average revenue per design
            const avgRevenuePerDesign =
                totalDesigns > 0 ? salesData.totalRevenue / totalDesigns : 0;

            return {
                ...salesData,
                designerMetrics: {
                    totalDesigns,
                    activeDesigns,
                    inactiveDesigns,
                    avgRevenuePerDesign,
                },
            };
        } catch (error) {
            logger.error('Error generating designer report:', { error, designerId });
            throw new AppError(
                `Failed to generate designer report: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    /**
     * Generate a design performance report
     * @param designId - Design ID to generate report for
     * @param filters - Additional filters like date range
     * @returns Design performance data
     */
    static async generateDesignReport(designId: string, filters: ReportFilters) {
        try {
            // Merge design ID with filters
            const reportFilters = { ...filters, designId };

            // Get sales report data filtered for this design
            const salesData = await this.generateSalesReport(reportFilters);

            // Get design details
            const design = await DesignModel.findById(designId).lean().exec();

            if (!design) {
                throw new AppError('Design not found', 404);
            }

            // Get sales by size
            const query: any = {
                'items.designId': new mongoose.Types.ObjectId(designId),
                status: filters.status || ['confirmed', 'processing', 'shipped', 'delivered'],
            };

            // Add date filters if provided
            if (filters.startDate || filters.endDate) {
                query.createdAt = {};
                if (filters.startDate) {
                    query.createdAt.$gte = filters.startDate;
                }
                if (filters.endDate) {
                    query.createdAt.$lte = filters.endDate;
                }
            }

            const orders = await Order.find(query).lean().exec();

            // Aggregate sales by size
            const salesBySize: Record<string, { quantity: number; revenue: number }> = {};

            orders.forEach((order) => {
                order.items.forEach((item) => {
                    if (item.designId.toString() === designId) {
                        if (!salesBySize[item.size]) {
                            salesBySize[item.size] = { quantity: 0, revenue: 0 };
                        }
                        salesBySize[item.size].quantity += item.quantity;
                        salesBySize[item.size].revenue += item.price * item.quantity;
                    }
                });
            });

            const salesBySizeArray = Object.entries(salesBySize)
                .map(([size, data]) => ({
                    size,
                    quantity: data.quantity,
                    revenue: data.revenue,
                }))
                .sort((a, b) => b.quantity - a.quantity);

            return {
                design: {
                    id: design._id.toString(),
                    title: design.designDetail.title,
                    description: design.designDetail.description,
                    price: design.designDetail.price,
                    designer: (design as any).userName,
                    designerId: design.userId.toString(),
                    image: design.image,
                },
                salesMetrics: {
                    totalQuantitySold: salesBySizeArray.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    ),
                    totalRevenue: salesBySizeArray.reduce((sum, item) => sum + item.revenue, 0),
                    salesBySize: salesBySizeArray,
                },
                salesByDate: salesData.salesByDate,
            };
        } catch (error) {
            logger.error('Error generating design report:', { error, designId });
            throw new AppError(
                `Failed to generate design report: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }
}
