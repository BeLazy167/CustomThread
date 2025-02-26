import { Request, Response } from "express";
import DesignModel from "../models/designModel";

export const createDesign = async (req: Request, res: Response) => {
  try {
    const design = new DesignModel(req.body);
    await design.save();
    res.status(201).json(design);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getDesigns = async (req: Request, res: Response) => {
  try {
    const designs = await DesignModel.find();
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getDesignById = async (req: Request, res: Response) => {
  try {
    const design = await DesignModel.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.status(200).json(design);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateDesign = async (req: Request, res: Response) => {
  try {
    const design = await DesignModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.status(200).json(design);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteDesign = async (req: Request, res: Response) => {
  try {
    const design = await DesignModel.findByIdAndDelete(req.params.id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
