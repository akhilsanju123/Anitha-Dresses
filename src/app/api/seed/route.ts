import { NextRequest } from 'next/server';
import { connectDB } from '../../../lib/db';
import { apiResponse } from '../../../lib/auth';
import Product from '../../../lib/models/Product';
import Category from '../../../lib/models/Category';
import Brand from '../../../lib/models/Brand';
import Settings from '../../../lib/models/Settings';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_SETTINGS 
} from '../../../lib/seedData';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    if (Product.db.readyState === 1) {
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Brand.deleteMany({});
      await Settings.deleteMany({});

      await Product.insertMany(INITIAL_PRODUCTS);
      await Category.insertMany(INITIAL_CATEGORIES);
      await Brand.insertMany(INITIAL_BRANDS);
      await Settings.create(INITIAL_SETTINGS);
    }

    return apiResponse(true, null, 'Database seeded successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Seeding failed', 500);
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
