import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../../lib/db';
import Category from '../../../../lib/models/Category';
import { apiResponse, authenticateAdmin } from '../../../../lib/auth';
import { Category as CategoryType } from '../../../../types';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    if (Category.db.readyState === 1) {
      const updated = await Category.findOneAndUpdate({ id }, body, { new: true });
      if (updated) {
        const store = getMemoryStore();
        store.categories = store.categories.map((c: CategoryType) => c.id === id ? { ...c, ...body } : c);
        return apiResponse(true, updated, 'Category updated successfully');
      }
    }

    const store = getMemoryStore();
    const idx = store.categories.findIndex((c: CategoryType) => c.id === id);
    if (idx !== -1) {
      store.categories[idx] = { ...store.categories[idx], ...body };
      return apiResponse(true, store.categories[idx], 'Category updated successfully');
    }

    return apiResponse(false, null, 'Category not found', 404);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to update category', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { id } = await params;
    await connectDB();

    if (Category.db.readyState === 1) {
      await Category.deleteOne({ id });
    }

    const store = getMemoryStore();
    store.categories = store.categories.filter((c: CategoryType) => c.id !== id);

    return apiResponse(true, { id }, 'Category deleted successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to delete category', 500);
  }
}
