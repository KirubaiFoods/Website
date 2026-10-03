import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Also protect API routes (except /api/admin/login and /api/admin/logout)
  if (
    pathname.startsWith('/api/admin') && 
    !pathname.startsWith('/api/admin/login') &&
    !pathname.startsWith('/api/admin/logout')
  ) {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
