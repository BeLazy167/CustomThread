import { RequestHandler, Router } from 'express';
import { DesignController } from '../../controllers/v1/design.controller';
import { authenticate } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate-request';
import { designValidation } from '../../validators/design.validator';
import { DesignModel } from '../../models/design.model';

const router = Router();
const designController = new DesignController();

router
    .route('/')
    .post(
        authenticate,
        validateRequest(designValidation.createDesign),
        designController.createDesign as unknown as RequestHandler
    )
    .get(designController.listDesigns as unknown as RequestHandler);

router.get('/search', designController.searchDesigns);

router.get('/random', designController.getRandomDesigns);

router
    .route('/:id')
    .get(designController.getDesign as unknown as RequestHandler)
    .patch(
        authenticate,
        validateRequest(designValidation.updateDesign),
        designController.updateDesign as unknown as RequestHandler
    )
    .delete(
        authenticate as unknown as RequestHandler,
        designController.deleteDesign as unknown as RequestHandler
    );

// Get designs for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [designs, total] = await Promise.all([
            DesignModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            DesignModel.countDocuments({ userId }),
        ]);

        res.json({
            designs: designs.map((design) => ({
                ...design.toJSON(),
                id: design._id,
            })),
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching user designs:', error);
        res.status(500).json({ error: 'Failed to fetch user designs' });
    }
});

export default router;
