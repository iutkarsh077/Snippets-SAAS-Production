import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers';

export const config = {
  matcher: ["/", '/profile', '/uploadSnippets', '/description/:path*', '/userChat', '/login', '/sign-up'],
}

// '/profile/:path*'
export async function middleware(request: NextRequest) {
  const cookie = cookies();
  const getUserCookie = cookie.get("snippets")?.value;
  const url = request.nextUrl;
  // console.log(url)
  if (getUserCookie && (url.pathname.startsWith("/login") || url.pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/uploadSnippets")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/description")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/userChat")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
