import mongoose, { Schema, Document } from 'mongoose';
import { SizeOption, ProductVariant, ProductLabel } from '../../types';

export interface IProductDocument extends Document {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  brand?: string;
  price: number;
  offerPrice: number;
  mrp: number;
  sku: string;
  barcode?: string;
  hsnCode?: string;
  description: string;
  specifications?: Record<string, string>;
  images: string[];
  sizes: SizeOption[];
  colors: { name: string; hex: string }[];
  variants: ProductVariant[];
  stock: number;
  lowStockThreshold: number;
  labels: ProductLabel[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
}

const ProductVariantSchema = new Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const ProductSchema = new Schema<IProductDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    brand: { type: String, index: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    mrp: { type: Number, required: true },
    sku: { type: String, required: true, index: true },
    barcode: { type: String },
    hsnCode: { type: String },
    description: { type: String, required: true },
    specifications: { type: Schema.Types.Mixed },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ name: String, hex: String }],
    variants: [ProductVariantSchema],
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    labels: [{ type: String }],
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
