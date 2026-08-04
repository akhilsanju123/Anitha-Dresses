import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../lib/db';
import Brand from '../../../lib/models/Brand';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';
import { Brand as BrandType } from '../../../types';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    if (Brand.db.readyState === 1) {
      const brands = await Brand.find({}).lean();
      return apiResponse(true, brands as unknown as BrandType[], 'Brands retrieved');
    }
    const store = getMemoryStore();
    return apiResponse(true, store.brands, 'Brands retrieved');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch brands', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const body = await req.json();
    await connectDB();

    const brandId = `brand-${Date.now()}`;
    const newBrand: BrandType = {
      id: brandId,
      name: body.name,
      description: body.description || '',
    };

    if (Brand.db.readyState === 1) {
      await Brand.create(newBrand);
    }
    const store = getMemoryStore();
    store.brands.push(newBrand);

    return apiResponse(true, newBrand, 'Brand created successfully', 201);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to create brand', 500);
  }
}
