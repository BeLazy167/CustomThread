import { Request, Response } from "express";
import { designService } from "../services/design.service";

export const designController = {
    createDesign: async (req: Request, res: Response) => {
        try {
            const design = await designService.createDesign(req.body);
            res.status(201).json(design);
        } catch (error) {
            res.status(500).json({ error: "Failed to create design" });
        }
    },
    getDesigns: async (req: Request, res: Response) => {
        try {
            const designs = await designService.getDesigns();
            res.json(designs);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch designs" });
        }
    },
    getDesignById: async (req: Request, res: Response) => {
        try {
            const design = await designService.getDesignById(req.params.id);
            if (!design)
                return res.status(404).json({ error: "Design not found" });
            res.json(design);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch design" });
        }
    },
};
