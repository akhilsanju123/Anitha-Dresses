import mongoose from 'mongoose';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_SETTINGS 
} from './seedData';
import { Product, Category, Brand, Order, WebsiteSettings } from '../types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anitha_dresses';

export interface GlobalMemoryStore {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  orders: Order[];
  settings: WebsiteSettings;
  users: any[];
  banners?: any[];
}

// In-Memory store fallback
const globalStore = (global as any).__anithaMemoryStore || {
  products: [...INITIAL_PRODUCTS],
  categories: [...INITIAL_CATEGORIES],
  brands: [...INITIAL_BRANDS],
  orders: [],
  settings: { ...INITIAL_SETTINGS },
  users: [
    { id: 'user-1', name: 'Anitha', email: 'anitha@anithadresses.com', role: 'super_admin', phone: '9618138383', createdAt: new Date().toISOString() },
    { id: 'user-2', name: 'Customer Test', email: 'customer@gmail.com', role: 'customer', phone: '9876543210', createdAt: new Date().toISOString() }
  ],
  banners: [],
};

(global as any).__anithaMemoryStore = globalStore;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return true;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    });
    console.log("Connected to MongoDB database successfully.");
    return true;
  } catch (error) {
    console.warn("MongoDB connection offline/failed. Falling back to high-performance in-memory state engine.");
    return false;
  }
}

export function getMemoryStore(): GlobalMemoryStore {
  return (global as any).__anithaMemoryStore;
}
