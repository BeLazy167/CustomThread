import mongoose, { Schema, Document } from 'mongoose';
import { Design } from '../types/design.types';

export interface DesignDocument extends Design, Document {}

const designSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        userName: {
            type: String,
            required: true,
        },
        designDetail: {
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 100,
            },
            description: {
                type: String,
                trim: true,
                maxlength: 1000,
            },
            tags: [
                {
                    type: String,
                    trim: true,
                },
            ],
            color: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        image: {
            type: String,
            required: true,
        },
        decal: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes
designSchema.index({ 'designDetail.tags': 1 });
designSchema.index({ createdAt: -1 });
designSchema.index({
    'designDetail.title': 'text',
    'designDetail.description': 'text',
});

export const DesignModel = mongoose.model<DesignDocument>('Design', designSchema);
