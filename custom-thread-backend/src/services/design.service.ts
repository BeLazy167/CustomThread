import { db } from "../config/database";
import { designs, designImages, designTags } from "../models/schema";

export const designService = {
    createDesign: async (designData: any) => {
        return await db.insert(designs).values(designData).returning();
    },
    getDesigns: async () => {
        return await db.select().from(designs);
    },
    getDesignById: async (id: string) => {
        const [design] = await db
            .select()
            .from(designs)
            .where(designs.id === id);
        return design;
    },
};
