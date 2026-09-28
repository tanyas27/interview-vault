import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function isValidToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    const encoder = new TextEncoder();
    await jwtVerify(token, encoder.encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login';
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/applications') ||
    pathname.startsWith('/rounds') ||
    pathname.startsWith('/questions') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/api');

  const validToken = token ? await isValidToken(token) : false;

  if (isProtectedRoute && !validToken) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    if (token && !validToken) {
      response.cookies.delete('auth_token');
    }
    return response;
  }

  if (isAuthRoute && validToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/applications/:path*',
    '/rounds/:path*',
    '/questions/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/api/:path*',
  ],
};

