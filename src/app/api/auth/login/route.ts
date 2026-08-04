import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, apiResponse } from '../../../../lib/auth';

const ADMIN_USERNAME = 'anitha';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('9618138383', 10);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    const inputUser = (username || email || '').trim().toLowerCase();
    const inputPass = (password || '').trim();

    if (!inputUser || !inputPass) {
      return apiResponse(false, null, 'Username and password are required', 400);
    }

    // Admin Credentials Validation (Username: Anitha | Password: 9618138383)
    const isAdminUser = inputUser === ADMIN_USERNAME || inputUser === 'anitha';
    const isPasswordValid = bcrypt.compareSync(inputPass, ADMIN_PASSWORD_HASH) || inputPass === '9618138383';

    if (isAdminUser && isPasswordValid) {
      const token = signToken({
        userId: 'admin-anitha',
        email: 'anitha@anithadresses.com',
        role: 'super_admin',
      });

      const response = NextResponse.json({
        success: true,
        data: { token, role: 'super_admin', name: 'Anitha' },
        message: 'Admin login successful',
      });

      // Set Secure HTTP-only Cookie for automatic server & browser session persistence
      response.cookies.set('anitha_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Customer Login Fallback
    const token = signToken({
      userId: `user-${Date.now()}`,
      email: inputUser.includes('@') ? inputUser : `${inputUser}@customer.com`,
      role: 'customer',
    });

    return apiResponse(true, { token, role: 'customer', name: inputUser }, 'Customer login successful');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Login failed', 500);
  }
}
