import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run middleware on routes that need auth:
     * - /account and sub-routes (protected - requires login)
     * - /checkout and sub-routes (protected - requires login)
     * - /login (redirect away if already logged in)
     * - /signup (redirect away if already logged in)
     * - /auth/callback (OAuth code exchange)
     * All other routes (public pages, API routes, static files) skip middleware entirely.
     */
    '/account/:path*',
    '/checkout/:path*',
    '/login',
    '/signup',
    '/auth/callback',
  ],
}
