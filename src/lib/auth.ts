import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'anitha_dresses_super_secret_jwt_key_2026_luxury_brand';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function apiResponse<T>(success: boolean, data?: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success,
      data,
      message: message || (success ? 'Success' : 'Error occurred'),
    },
    { status }
  );
}

export function extractTokenFromRequest(request: Request): string | null {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. Check request cookies (NextRequest)
  if ('cookies' in request && typeof (request as NextRequest).cookies?.get === 'function') {
    const cookie = (request as NextRequest).cookies.get('anitha_admin_token');
    if (cookie?.value) return cookie.value;
  }

  // 3. Fallback parse raw Cookie header
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/anitha_admin_token=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

export function authenticateAdmin(
  request: Request,
  allowedRoles: UserRole[] = ['super_admin', 'store_admin', 'staff']
): { authorized: boolean; payload?: TokenPayload; response?: NextResponse } {
  const token = extractTokenFromRequest(request);

  if (!token) {
    return {
      authorized: false,
      response: apiResponse(false, null, 'Unauthorized access: Admin login required', 401),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      authorized: false,
      response: apiResponse(false, null, 'Session expired or invalid token. Please log in again.', 401),
    };
  }

  if (!allowedRoles.includes(payload.role)) {
    return {
      authorized: false,
      response: apiResponse(false, null, 'Forbidden: Insufficient privileges', 403),
    };
  }

  return { authorized: true, payload };
}
