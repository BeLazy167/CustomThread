import { Request, Response } from 'express';
import { DesignService } from '../../services/design.service';
import { AuthRequest } from '../../middleware/auth';
import { DesignCreateInput, DesignUpdateInput, DesignQueryOptions } from '../../types/design.types';

export class DesignController {
    private designService: DesignService;

    constructor() {
        this.designService = new DesignService();
    }

    createDesign = async (req: AuthRequest, res: Response) => {
        try {
            const designData: DesignCreateInput = {
                ...req.body,
                userId: req.auth?.userId || req.body.userId,
                username: req.body.username, // Use username from request body only
            };
            const design = await this.designService.create(designData);
            res.status(201).json(design);
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to create design',
            });
        }
    };

    getDesign = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const design = await this.designService.findById(id);

            if (!design) {
                return res.status(404).json({ message: 'Design not found' });
            }

            res.json(design);
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to get design',
            });
        }
    };

    listDesigns = async (req: Request, res: Response) => {
        try {
            const options: DesignQueryOptions = {
                userId: req.query.userId as string,
                userName: req.query.userName as string,
                tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                sortBy: req.query.sortBy as string,
                sortOrder: req.query.sortOrder as 'asc' | 'desc',
            };

            const result = await this.designService.findAll(options);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to list designs',
            });
        }
    };

    updateDesign = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const updateData: DesignUpdateInput = req.body;
            const design = await this.designService.update(id, updateData);

            if (!design) {
                return res.status(404).json({ message: 'Design not found' });
            }

            res.json(design);
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to update design',
            });
        }
    };

    deleteDesign = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const design = await this.designService.delete(id);

            if (!design) {
                return res.status(404).json({ message: 'Design not found' });
            }

            res.json({ message: 'Design deleted successfully' });
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to delete design',
            });
        }
    };

    searchDesigns = async (req: Request, res: Response) => {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ message: 'Search query is required' });
            }

            const options: DesignQueryOptions = {
                userId: req.query.userId as string,
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            };

            const result = await this.designService.searchDesigns(q as string, options);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to search designs',
            });
        }
    };
}
