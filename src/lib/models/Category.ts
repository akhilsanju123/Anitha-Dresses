import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryDocument extends Document {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  subcategories: string[];
  itemCount?: number;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String },
    subcategories: [{ type: String }],
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);
