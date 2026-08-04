import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../../lib/db';
import Product from '../../../../lib/models/Product';
import { apiResponse, authenticateAdmin } from '../../../../lib/auth';
import { Product as ProductType } from '../../../../types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    if (Product.db.readyState === 1) {
      const product = await Product.findOne({ id }).lean();
      if (product) return apiResponse(true, product, 'Product found');
    }

    const store = getMemoryStore();
    const product = store.products.find((p: ProductType) => p.id === id);
    if (!product) return apiResponse(false, null, 'Product not found', 404);

    return apiResponse(true, product, 'Product found');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Error fetching product', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    if (Product.db.readyState === 1) {
      const updated = await Product.findOneAndUpdate({ id }, body, { new: true });
      if (updated) {
        const store = getMemoryStore();
        store.products = store.products.map((p: ProductType) => p.id === id ? { ...p, ...body } : p);
        return apiResponse(true, updated, 'Product updated successfully');
      }
    }

    const store = getMemoryStore();
    const idx = store.products.findIndex((p: ProductType) => p.id === id);
    if (idx === -1) return apiResponse(false, null, 'Product not found', 404);

    store.products[idx] = { ...store.products[idx], ...body };
    return apiResponse(true, store.products[idx], 'Product updated successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to update product', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { id } = await params;
    await connectDB();

    if (Product.db.readyState === 1) {
      await Product.deleteOne({ id });
    }

    const store = getMemoryStore();
    store.products = store.products.filter((p: ProductType) => p.id !== id);

    return apiResponse(true, { id }, 'Product deleted successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to delete product', 500);
  }
}
