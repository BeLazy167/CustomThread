import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../../services/report.service';
import { AppError } from '../../middleware/error.middleware';
import { logger } from '../../config/logger';

// Extended request interface with auth property
interface AuthRequest extends Request {
    auth?: {
        userId: string;
        sessionId: string;
    };
}

export class ReportController {
    /**
     * Generate a sales report with analytics
     */
    static async generateSalesReport(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // Parse filters from query parameters
            const filters = {
                startDate: req.query.startDate
                    ? new Date(req.query.startDate as string)
                    : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                designerId: req.query.designerId as string,
                designId: req.query.designId as string,
                status: req.query.status ? (req.query.status as string).split(',') : undefined,
            };

            // Validate date range
            if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
                throw new AppError('Start date cannot be after end date', 400);
            }

            // Generate the report
            const reportData = await ReportService.generateSalesReport(filters);

            // Log report generation
            logger.info('Sales report generated', {
                userId: req.auth?.userId,
                filters,
            });

            res.json({
                success: true,
                data: reportData,
                filters,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate a designer performance report
     */
    static async generateDesignerReport(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { designerId } = req.params;

            if (!designerId) {
                throw new AppError('Designer ID is required', 400);
            }

            // Parse filters from query parameters
            const filters = {
                startDate: req.query.startDate
                    ? new Date(req.query.startDate as string)
                    : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                status: req.query.status ? (req.query.status as string).split(',') : undefined,
            };

            // Validate date range
            if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
                throw new AppError('Start date cannot be after end date', 400);
            }

            // Authentication check temporarily disabled for development
            // const isAdmin =
            //     req.auth?.userId === process.env.ADMIN_USER_ID ||
            //     (process.env.NODE_ENV !== 'production' && req.auth?.userId === 'dev_user_123');
            // const isOwnReport = req.auth?.userId === designerId;

            // if (!isAdmin && !isOwnReport) {
            //     throw new AppError(
            //         'You can only access your own reports unless you are an admin',
            //         403
            //     );
            // }

            // Generate the report
            const reportData = await ReportService.generateDesignerReport(designerId, filters);

            // Log report generation
            logger.info('Designer report generated', {
                userId: req.auth?.userId,
                designerId,
                filters,
            });

            res.json({
                success: true,
                data: reportData,
                filters,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate a design performance report
     */
    static async generateDesignReport(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { designId } = req.params;

            if (!designId) {
                throw new AppError('Design ID is required', 400);
            }

            // Parse filters from query parameters
            const filters = {
                startDate: req.query.startDate
                    ? new Date(req.query.startDate as string)
                    : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                status: req.query.status ? (req.query.status as string).split(',') : undefined,
            };

            // Validate date range
            if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
                throw new AppError('Start date cannot be after end date', 400);
            }

            // Generate the report
            const reportData = await ReportService.generateDesignReport(designId, filters);

            // Authentication check temporarily disabled for development
            // const isAdmin =
            //     req.auth?.userId === process.env.ADMIN_USER_ID ||
            //     (process.env.NODE_ENV !== 'production' && req.auth?.userId === 'dev_user_123');
            // const isDesigner = req.auth?.userId === reportData.design.designerId;

            // if (!isAdmin && !isDesigner) {
            //     throw new AppError(
            //         'You can only access reports for your own designs unless you are an admin',
            //         403
            //     );
            // }

            // Log report generation
            logger.info('Design report generated', {
                userId: req.auth?.userId,
                designId,
                filters,
            });

            res.json({
                success: true,
                data: reportData,
                filters,
            });
        } catch (error) {
            next(error);
        }
    }
}
