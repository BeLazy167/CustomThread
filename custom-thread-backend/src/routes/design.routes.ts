import { Router } from "express";
import { designController } from "../controllers/design.controller";

const router = Router();

router.post("/", designController.createDesign);
router.get("/", designController.getDesigns);

export default router;
