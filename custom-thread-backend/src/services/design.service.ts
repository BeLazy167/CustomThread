import { DesignModel, DesignDocument } from '../models/design.model';
import { DesignCreateInput, DesignUpdateInput, DesignQueryOptions } from '../types/design.types';

export class DesignService {
    async create(data: DesignCreateInput): Promise<DesignDocument> {
        const design = new DesignModel(data);
        return design.save();
    }

    async findById(id: string): Promise<DesignDocument | null> {
        return DesignModel.findById(id);
    }

    async findAll(options: DesignQueryOptions = {}): Promise<{
        designs: DesignDocument[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const {
            userId,
            tags,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options;

        const query: any = {};
        if (userId) query.userId = userId;
        if (tags?.length) query['designDetail.tags'] = { $in: tags };

        const skip = (page - 1) * limit;
        const [designs, total] = await Promise.all([
            DesignModel.find(query)
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit),
            DesignModel.countDocuments(query),
        ]);

        return {
            designs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(id: string, data: DesignUpdateInput): Promise<DesignDocument | null> {
        return DesignModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    }

    async delete(id: string): Promise<DesignDocument | null> {
        return DesignModel.findByIdAndDelete(id);
    }

    async searchDesigns(
        searchTerm: string,
        options: DesignQueryOptions = {}
    ): Promise<{
        designs: DesignDocument[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10, userId } = options;

        const query: any = {
            $text: { $search: searchTerm },
        };
        if (userId) query.userId = userId;

        const skip = (page - 1) * limit;
        const [designs, total] = await Promise.all([
            DesignModel.find(query)
                .sort({ score: { $meta: 'textScore' } })
                .skip(skip)
                .limit(limit),
            DesignModel.countDocuments(query),
        ]);

        return {
            designs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
}
