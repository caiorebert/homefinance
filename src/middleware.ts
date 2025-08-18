import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/home', '/perfil', '/admin', '/chef'];

const publicOnlyRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXT_PUBLIC_JWT_SECRET });
  const isAuthenticated = !!token;

  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  if (
    publicOnlyRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/home';
    return NextResponse.redirect(dashboardUrl);
  }


  return NextResponse.next();
}

export const config = {
    matcher: [
      '/',
      '/home',
      '/login',
      '/register',
      '/dashboard/:path*',
      '/perfil/:path*',
      '/chef/:path*',
      '/admin/:path*',
    ],
  };