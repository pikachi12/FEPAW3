import { NextRequest, NextResponse } from 'next/server';

// Proxy hanya untuk info, real protection ada di client-side (ProtectedRoute)
// httpOnly cookie dikirim otomatis oleh browser ke backend
export function proxy(request: NextRequest) {
  // Let all requests through, ProtectedRoute component handles client-side auth
  // Backend endpoint akan check cookie otomatis
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dosen/:path*', '/alumni/:path*', '/mahasiswa/:path*'],
};
