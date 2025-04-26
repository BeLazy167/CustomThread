import { Router } from 'express';
import { ReportController } from '../../controllers/v1/report.controller';
import { verifyAuth } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/isAdmin';

const router = Router();

/**
 * @route   GET /api/v1/reports/sales
 * @desc    Generate a sales report with analytics
 * @access  Public (temporarily for development)
 */
router.get('/sales', ReportController.generateSalesReport);

/**
 * @route   GET /api/v1/reports/designers/:designerId
 * @desc    Generate a designer performance report
 * @access  Public (temporarily for development)
 */
router.get('/designers/:designerId', ReportController.generateDesignerReport);

/**
 * @route   GET /api/v1/reports/designs/:designId
 * @desc    Generate a design performance report
 * @access  Public (temporarily for development)
 */
router.get('/designs/:designId', ReportController.generateDesignReport);

export default router;
