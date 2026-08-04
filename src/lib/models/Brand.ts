import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandDocument extends Document {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

const BrandSchema = new Schema<IBrandDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    logo: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Brand || mongoose.model<IBrandDocument>('Brand', BrandSchema);
