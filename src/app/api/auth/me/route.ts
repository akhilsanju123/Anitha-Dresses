import { NextRequest } from 'next/server';
import { authenticateAdmin, apiResponse } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  const auth = authenticateAdmin(req);
  if (!auth.authorized || !auth.payload) {
    return apiResponse(false, null, 'Not authenticated', 401);
  }

  return apiResponse(true, {
    userId: auth.payload.userId,
    email: auth.payload.email,
    role: auth.payload.role,
  }, 'Authenticated');
}
