import mongoose, { Schema, type Document } from 'mongoose';

interface IOrderItem {
    designId: mongoose.Types.ObjectId;
    quantity: number;
    size: string;
    price: number;
    customizations?: {
        color?: string;
        text?: string;
        placement?: string;
    };
}

interface IShippingDetails {
    name: string;
    email: string;
    address: string;
    city: string;
    contact: string;
    country: string;
    postalCode: string;
}

export interface IOrder extends Document {
    user: string;
    items: IOrderItem[];
    shippingDetails: IShippingDetails;
    status: string;
    totalAmount: number;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    user: {
        type: String,
        required: true,
    },
    items: [
        {
            designId: {
                type: Schema.Types.ObjectId,
                ref: 'Design',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            size: {
                type: String,
                required: true,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            },
            price: {
                type: Number,
                required: true,
            },
            customizations: {
                color: String,
                text: String,
                placement: {
                    type: String,
                    enum: ['front', 'back', 'left-sleeve', 'right-sleeve'],
                },
            },
        },
    ],
    shippingDetails: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        required: true,
        enum: [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'payment_failed',
        ],
        default: 'pending',
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IOrder>('Order', OrderSchema);
