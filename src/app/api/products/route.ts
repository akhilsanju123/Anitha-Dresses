import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../lib/db';
import Product from '../../../lib/models/Product';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';
import { Product as ProductType } from '../../../types';
import { INITIAL_PRODUCTS } from '../../../lib/seedData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const size = searchParams.get('size') || '';
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const sortBy = searchParams.get('sortBy') || 'latest';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 100;

    let products: ProductType[] = [];

    if (Product.db.readyState === 1) {
      // Auto-seed MongoDB if collection is empty
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(INITIAL_PRODUCTS);
      }

      const filter: any = {};
      if (category && category !== 'All') {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (brand && brand !== 'All') {
        filter.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
      }
      if (size && size !== 'All') {
        filter.sizes = size;
      }
      if (maxPrice > 0) {
        filter.offerPrice = { $lte: maxPrice };
      }

      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { subcategory: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } },
          { sku: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ];
      }

      let sortObj: any = { createdAt: -1 };
      if (sortBy === 'price_low') sortObj = { offerPrice: 1 };
      if (sortBy === 'price_high') sortObj = { offerPrice: -1 };
      if (sortBy === 'popular') sortObj = { rating: -1 };

      const skip = (page - 1) * limit;
      const rawProducts = await Product.find(filter).sort(sortObj).skip(skip).limit(limit).lean();
      products = rawProducts as unknown as ProductType[];
    } else {
      const store = getMemoryStore();
      products = store.products.filter((p: ProductType) => {
        if (category && category !== 'All' && p.category.toLowerCase() !== category.toLowerCase()) return false;
        if (brand && brand !== 'All' && p.brand?.toLowerCase() !== brand.toLowerCase()) return false;
        if (size && size !== 'All' && !p.sizes.includes(size as any)) return false;
        if (p.offerPrice > maxPrice) return false;
        if (query) {
          const q = query.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchSub = p.subcategory ? p.subcategory.toLowerCase().includes(q) : false;
          if (!matchName && !matchSku && !matchCat && !matchSub) return false;
        }
        return true;
      });
    }

    return apiResponse(true, products, 'Products retrieved successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch products', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const body = await req.json();
    await connectDB();

    const productId = body.id || `prod-${Date.now()}`;
    const newProduct: ProductType = {
      _id: productId,
      id: productId,
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: body.category,
      subcategory: body.subcategory || '',
      brand: body.brand || 'Anitha Exclusive',
      price: Number(body.price),
      offerPrice: Number(body.offerPrice || body.price),
      mrp: Number(body.mrp || body.price * 1.3),
      sku: body.sku || `AD-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: body.barcode || '890123456789',
      hsnCode: body.hsnCode || '6204',
      description: body.description || '',
      specifications: body.specifications || {},
      images: body.images && body.images.length > 0 ? body.images : [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=85"
      ],
      sizes: body.sizes || ["S", "M", "L", "XL"],
      colors: body.colors || [{ name: "Deep Maroon", hex: "#4A0E17" }],
      variants: body.variants || [{ size: "M", color: "Deep Maroon", stock: Number(body.stock || 10) }],
      stock: Number(body.stock || 10),
      lowStockThreshold: Number(body.lowStockThreshold || 5),
      labels: body.labels || ["new"],
      featured: Boolean(body.featured),
      bestSeller: Boolean(body.bestSeller),
      newArrival: true,
      rating: 4.8,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (Product.db.readyState === 1) {
      await Product.create(newProduct);
    }

    const store = getMemoryStore();
    const existingIdx = store.products.findIndex((p: ProductType) => p.id === productId);
    if (existingIdx > -1) {
      store.products[existingIdx] = newProduct;
    } else {
      store.products.unshift(newProduct);
    }

    return apiResponse(true, newProduct, 'Product created successfully', 201);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to create product', 500);
  }
}
