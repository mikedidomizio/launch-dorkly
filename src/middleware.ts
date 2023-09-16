import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let ldTokenCookie = request.cookies.get('LD_TOKEN')

  // if the cookie doesn't exist we immediately redirect the user back to
  if (!ldTokenCookie) {
    return NextResponse.redirect(new URL('/start', request.url))
  }
}

export const config = {
  matcher: ['/copy/:path*', '/project/:path*', '/api/:path*'],
}
