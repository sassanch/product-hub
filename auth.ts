import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";
import { isAllowedGoogleProfile, isPublicAuthPath } from "@/lib/auth-policy";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({ authorization: { params: { hd: process.env.AUTH_ALLOWED_DOMAIN || "plei.com" } } })],
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    signIn({ account, profile }) {
      return account?.provider === "google" && isAllowedGoogleProfile(profile);
    },
    authorized({ auth: session, request }) {
      const { pathname, search } = request.nextUrl;
      if (isPublicAuthPath(pathname)) return true;
      if (session?.user) return true;
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const loginUrl = new URL("/login", request.nextUrl);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    },
  },
});
