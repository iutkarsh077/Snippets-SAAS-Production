import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers';

export const config = {
  matcher: ["/", '/profile', '/uploadSnippets', '/userChat'],
}
export async function middleware(request: NextRequest) {
  const cookie = cookies();
  const getUserCookie = cookie.get("snippets")?.value;
  // console.log(getUserCookie)
  const url = request.nextUrl;
  if (!getUserCookie && url.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/uploadSnippets")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/userChat")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
