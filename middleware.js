import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run middleware on routes that REQUIRE server-side auth enforcement:
     * - /account and sub-routes (must be logged in)
     * - /checkout and sub-routes (must be logged in)
     * - /auth/callback (OAuth code exchange)
     *
     * /login and /signup are intentionally excluded — the login page handles
     * already-logged-in redirects client-side to avoid middleware timeouts.
     */
    '/account/:path*',
    '/checkout/:path*',
    '/auth/callback',
  ],
}
