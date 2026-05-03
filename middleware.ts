import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteger rutas /admin/* excepto /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = req.cookies.get('admin_session');
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!session || session.value !== validPassword) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
