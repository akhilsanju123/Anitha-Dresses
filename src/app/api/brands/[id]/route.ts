import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../../lib/db';
import Brand from '../../../../lib/models/Brand';
import { apiResponse, authenticateAdmin } from '../../../../lib/auth';
import { Brand as BrandType } from '../../../../types';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    if (Brand.db.readyState === 1) {
      const updated = await Brand.findOneAndUpdate({ id }, body, { new: true });
      if (updated) {
        const store = getMemoryStore();
        store.brands = store.brands.map((b: BrandType) => b.id === id ? { ...b, ...body } : b);
        return apiResponse(true, updated, 'Brand updated successfully');
      }
    }

    const store = getMemoryStore();
    const idx = store.brands.findIndex((b: BrandType) => b.id === id);
    if (idx !== -1) {
      store.brands[idx] = { ...store.brands[idx], ...body };
      return apiResponse(true, store.brands[idx], 'Brand updated successfully');
    }

    return apiResponse(false, null, 'Brand not found', 404);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to update brand', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { id } = await params;
    await connectDB();

    if (Brand.db.readyState === 1) {
      await Brand.deleteOne({ id });
    }

    const store = getMemoryStore();
    store.brands = store.brands.filter((b: BrandType) => b.id !== id);

    return apiResponse(true, { id }, 'Brand deleted successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to delete brand', 500);
  }
}
