import mongoose, { Schema, Document } from "mongoose";

interface DesignDetail {
  title: string;
  description: string;
  tags: string[];
  color: string;
  price?: number;
}

interface DesignSchema extends Document {
  userId: string;
  designDetail: DesignDetail;
  image: string;
  decal: string;
}

const DesignSchemaModel = new Schema<DesignSchema>({
  userId: { type: String, required: true },
  designDetail: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    color: { type: String, required: true },
    price: {
      type: Number,
      default: 29.99,
    },
  },
  image: {  
    type: String,
    required: true,
  },
  decal: {
    type: String,
    required: true,
  },
});

export default mongoose.model<DesignSchema>("Design", DesignSchemaModel);
export { DesignSchema };
