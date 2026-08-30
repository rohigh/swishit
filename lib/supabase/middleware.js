import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // If code param is present on non-callback routes, redirect to /auth/callback to exchange the auth token
  if (request.nextUrl.searchParams.has('code') && !request.nextUrl.pathname.startsWith('/auth/callback')) {
    const callbackUrl = new URL('/auth/callback', request.url)
    callbackUrl.search = request.nextUrl.search
    return NextResponse.redirect(callbackUrl)
  }

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isProtectedRoute = pathname.startsWith('/account') || pathname.startsWith('/checkout')

  // Only call getSession() (cookie-based, no network) to avoid Vercel middleware timeout.
  // getUser() makes a network request to Supabase on every request which causes 504s.
  // Use getUser() in Server Components/Actions where you need verified auth.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && isProtectedRoute) {
    // If not logged in and trying to access a protected route, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    if (pathname !== '/login') {
      url.searchParams.set('redirect_to', pathname)
    }
    return NextResponse.redirect(url)
  }

  if (session && isAuthRoute) {
    // If logged in and trying to access login/signup page, redirect based on redirect_to or home
    const redirectTo = request.nextUrl.searchParams.get('redirect_to') || '/'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return supabaseResponse
}
