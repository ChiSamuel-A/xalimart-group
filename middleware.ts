import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth is handled client-side via Clerk's useUser() hook in page.tsx.
// No server-side route protection needed — this middleware is a clean pass-through.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
