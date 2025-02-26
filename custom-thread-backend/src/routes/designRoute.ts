import { Router } from "express";
import { createDesign, getDesigns } from "../controllers/designController";

const router = Router();

router.post("/", createDesign);         // Create a new design
router.get("/", getDesigns);            // Get all designs


export default router;
