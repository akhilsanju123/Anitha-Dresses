import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../lib/db';
import Category from '../../../lib/models/Category';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';
import { Category as CategoryType } from '../../../types';
import { INITIAL_CATEGORIES } from '../../../lib/seedData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    let categories: CategoryType[] = [];

    if (Category.db.readyState === 1) {
      const count = await Category.countDocuments();
      if (count === 0) {
        await Category.insertMany(INITIAL_CATEGORIES);
      }
      const rawCategories = await Category.find({}).lean();
      categories = rawCategories as unknown as CategoryType[];
    } else {
      const store = getMemoryStore();
      categories = store.categories;
    }

    return apiResponse(true, categories, 'Categories retrieved successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch categories', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const body = await req.json();
    await connectDB();

    // If payload is an array of categories (bulk save/sync)
    if (Array.isArray(body)) {
      if (Category.db.readyState === 1) {
        // Upsert every category into MongoDB
        for (const cat of body) {
          const catId = cat.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          const catDoc = {
            id: catId,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            image: cat.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            description: cat.description || '',
            subcategories: cat.subcategories || [],
            itemCount: cat.itemCount || 0,
          };
          await Category.findOneAndUpdate({ id: catId }, catDoc, { upsert: true, new: true });
        }
      }

      const store = getMemoryStore();
      store.categories = body;
      return apiResponse(true, body, 'Categories synced successfully', 200);
    }

    // Single category save / update
    const catId = body.id || `cat-${Date.now()}`;
    const newCat: CategoryType = {
      id: catId,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      image: body.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      description: body.description || '',
      subcategories: body.subcategories || [],
      itemCount: body.itemCount || 0,
    };

    if (Category.db.readyState === 1) {
      await Category.findOneAndUpdate({ id: catId }, newCat, { upsert: true, new: true });
    }

    const store = getMemoryStore();
    const existingIdx = store.categories.findIndex((c: CategoryType) => c.id === catId);
    if (existingIdx > -1) {
      store.categories[existingIdx] = newCat;
    } else {
      store.categories.push(newCat);
    }

    return apiResponse(true, newCat, 'Category saved successfully to MongoDB', 201);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to save category to MongoDB', 500);
  }
}
