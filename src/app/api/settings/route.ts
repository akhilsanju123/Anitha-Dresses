import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../lib/db';
import Settings from '../../../lib/models/Settings';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';
import { INITIAL_SETTINGS } from '../../../lib/seedData';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    if (Settings.db.readyState === 1) {
      const settings = await Settings.findOne({}).lean();
      if (settings) return apiResponse(true, settings, 'Settings retrieved');
    }
    const store = getMemoryStore();
    return apiResponse(true, store.settings, 'Settings retrieved');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch settings', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const body = await req.json();
    await connectDB();

    if (Settings.db.readyState === 1) {
      await Settings.deleteMany({});
      await Settings.create(body);
    }

    const store = getMemoryStore();
    store.settings = { ...store.settings, ...body };

    return apiResponse(true, store.settings, 'Settings updated successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to update settings', 500);
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
