import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../lib/db';
import User from '../../../lib/models/User';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    await connectDB();

    if (User.db.readyState === 1) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
      return apiResponse(true, users, 'Users retrieved');
    }

    const store = getMemoryStore();
    return apiResponse(true, store.users || [
      { id: 'user-1', name: 'Anitha', email: 'anitha@anithadresses.com', role: 'super_admin', phone: '9618138383', createdAt: new Date().toISOString() },
      { id: 'user-2', name: 'Customer Test', email: 'customer@gmail.com', role: 'customer', phone: '9876543210', createdAt: new Date().toISOString() }
    ], 'Users retrieved');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch users', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return apiResponse(false, null, 'User ID is required', 400);

    await connectDB();

    if (User.db.readyState === 1) {
      await User.deleteOne({ _id: id });
    }

    const store = getMemoryStore();
    if (store.users) {
      store.users = store.users.filter((u: any) => u.id !== id && u._id !== id);
    }

    return apiResponse(true, { id }, 'User deleted successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to delete user', 500);
  }
}
