import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const HOME: Record<string, string> = {
  SUPER_ADMIN: '/super-admin',
  HOSPITAL_ADMIN: '/hospital-admin',
  DOCTOR: '/doctor',
  PATIENT: '/patient',
};

const RULES: { prefix: string; roles: string[] }[] = [
  { prefix: '/super-admin', roles: ['SUPER_ADMIN'] },
  { prefix: '/hospital-admin', roles: ['HOSPITAL_ADMIN'] },
  { prefix: '/admin', roles: ['HOSPITAL_ADMIN'] },
  { prefix: '/doctor', roles: ['DOCTOR'] },
  { prefix: '/patient', roles: ['PATIENT'] },
  { prefix: '/queue', roles: ['HOSPITAL_ADMIN', 'DOCTOR'] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rule = RULES.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`));
  if (!rule) {
    return NextResponse.next();
  }

  const role = request.cookies.get('pulsecare.role')?.value;
  if (!role) {
    const login = request.nextUrl.clone();
    login.pathname = '/login';
    return NextResponse.redirect(login);
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const dest = request.nextUrl.clone();
    dest.pathname = pathname.replace(/^\/admin/, '/hospital-admin') || '/hospital-admin';
    return NextResponse.redirect(dest);
  }

  if (!rule.roles.includes(role)) {
    const dest = request.nextUrl.clone();
    dest.pathname = HOME[role] ?? '/login';
    return NextResponse.redirect(dest);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/super-admin',
    '/super-admin/:path*',
    '/hospital-admin',
    '/hospital-admin/:path*',
    '/admin',
    '/admin/:path*',
    '/doctor',
    '/doctor/:path*',
    '/patient',
    '/patient/:path*',
    '/queue',
    '/queue/:path*',
  ],
};
