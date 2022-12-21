import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const secret = process.env.SECRET;

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const session = await getToken({ req, secret, raw: true });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: ["/login", "/signup"],
};
