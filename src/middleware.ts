import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeAndVerifyJwtToken } from "./server/lib/auth";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("middleware");
  const cookies: RequestCookies = request.cookies;
  const token = cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  if (!token) {
    console.error("No token found");
    if (pathname === "/dashboard") {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  const verify = await decodeAndVerifyJwtToken(token);

  if (!verify) {
    console.error("Invalid token");
    if (pathname === "/dashboard") {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  console.log(request.nextUrl.pathname, "pathname");
  if (
    request.nextUrl.pathname === "/signin" ||
    request.nextUrl.pathname === "/signup"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signin", "/dashboard", "/signup"],
};
