import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🚨 MIDDLEWARE TRIGGERED FOR:', request.nextUrl.pathname)
  
  // Check for any Supabase auth cookies (they start with 'sb-')
  const hasAuthCookies = Array.from(request.cookies.getAll()).some(cookie => 
    cookie.name.startsWith('sb-') && cookie.value
  )
  
  // If no Supabase auth cookies found, redirect to auth
  if (!hasAuthCookies) {
    console.log('🚫 NO SUPABASE AUTH COOKIES - REDIRECTING TO AUTH')
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  console.log('✅ SUPABASE AUTH COOKIES FOUND - ALLOWING ACCESS')
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/generate-course/:path*',
    '/courses/:path*',
    '/assessments/:path*',
    '/chat/:path*',
    '/course/:path*',
    '/lesson/:path*',
    '/assessment/:path*',
  ],
}