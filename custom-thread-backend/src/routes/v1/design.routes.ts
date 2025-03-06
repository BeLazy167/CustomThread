import { RequestHandler, Router } from 'express';
import { DesignController } from '../../controllers/v1/design.controller';
import { authenticate } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate-request';
import { designValidation } from '../../validators/design.validator';

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

export default router;
