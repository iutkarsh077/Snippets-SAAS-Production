import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createBucket, TryAndRemove } from "./helpers/tokenBucket";
import { Redis } from "@upstash/redis";

export const config = {
  matcher: [
    "/",
    "/profile",
    "/uploadSnippets",
    "/description/:path*",
    "/userChat",
    "/login",
    "/sign-up",
  ],
};

const redis = Redis.fromEnv();
// '/profile/:path*'
export async function middleware(request: NextRequest, res: NextResponse) {
  const cookie = cookies();
  const getUserCookie = cookie.get("snippets")?.value;
  const url = request.nextUrl;
  // console.log(url)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  // console.log("Ip is: ", ip);
  
  const bucketToken = await redis.hget("ratelimiter", ip);
  let onebucket;

  if(!bucketToken){
    onebucket = createBucket(50, 1);
  }else{
    onebucket = bucketToken;
  }

  if(!TryAndRemove(onebucket)){
    return NextResponse.json(
      { message: "Request Limit Exceeded", status: false },
      { status: 429 }
    );
  }

  await redis.hset("ratelimiter", { [ip]: onebucket });
  await redis.expire("ratelimit", 60 * 60);
  if (
    getUserCookie &&
    (url.pathname.startsWith("/login") || url.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/uploadSnippets")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/description")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!getUserCookie && url.pathname.startsWith("/userChat")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
