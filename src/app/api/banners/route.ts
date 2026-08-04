import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../lib/db';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const store = getMemoryStore();

    const banners = store.banners || [
      {
        id: 'banner-1',
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=85",
        tagline: "Royal Family Fashion Experience",
        title: "ANITHA DRESSES SHOPPING MALL",
        subtitle: "High quality fashion apparel for Men, Ladies, and Kids at wholesale boutique prices.",
        cta: "Explore Collection",
        link: "/products",
      },
      {
        id: 'banner-2',
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85",
        tagline: "Festive & Ethnic Special Edition",
        title: "Traditional & Modern Fashion",
        subtitle: "Discover perfect fashion collections for every member of your family at ANITHA DRESSES!",
        cta: "View Offers",
        link: "/offers",
      }
    ];

    return apiResponse(true, banners, 'Banners retrieved');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch banners', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const body = await req.json();
    const store = getMemoryStore();
    if (!store.banners) store.banners = [];

    const newBanner = {
      id: `banner-${Date.now()}`,
      image: body.image,
      tagline: body.tagline || 'ANITHA DRESSES Exclusive',
      title: body.title || 'New Season Collection',
      subtitle: body.subtitle || 'Explore our latest arrivals.',
      cta: body.cta || 'Shop Now',
      link: body.link || '/products',
    };

    store.banners.unshift(newBanner);
    return apiResponse(true, newBanner, 'Banner created successfully', 201);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to create banner', 500);
  }
}
