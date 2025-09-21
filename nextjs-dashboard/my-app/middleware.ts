import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🚨 MIDDLEWARE TRIGGERED FOR:', request.nextUrl.pathname)
  
  // Simple test - redirect /dashboard to /auth
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('🚫 BLOCKING ACCESS TO DASHBOARD')
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/gen-course/:path*',
    '/courses/:path*',
    '/assessments/:path*',
    '/chat/:path*',
    '/course/:path*',
    '/lesson/:path*',
    '/assessment/:path*',
  ],
}