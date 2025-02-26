import { z } from 'zod';

const designDetailSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(1000).optional(),
    tags: z.array(z.string()).min(1).max(10),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    price: z.number().min(0),
});

export const designValidation = {
    createDesign: z.object({
        body: z.object({
            userId: z.string().optional(),
            designDetail: designDetailSchema,
            image: z.string().url(),
            decal: z.string().url().optional(),
        }),
    }),

    updateDesign: z.object({
        params: z.object({
            id: z.string(),
        }),
        body: z.object({
            designDetail: designDetailSchema.partial().optional(),
            image: z.string().url().optional(),
            decal: z.string().url().optional(),
        }),
    }),

    queryDesigns: z.object({
        query: z.object({
            userId: z.string().optional(),
            tags: z.string().optional(),
            page: z.string().regex(/^\d+$/).optional(),
            limit: z.string().regex(/^\d+$/).optional(),
            sortBy: z.string().optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
        }),
    }),

    searchDesigns: z.object({
        query: z.object({
            q: z.string().min(1),
            userId: z.string().optional(),
            page: z.string().regex(/^\d+$/).optional(),
            limit: z.string().regex(/^\d+$/).optional(),
        }),
    }),
};
