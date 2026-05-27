import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const STAFF_ROLES = ["staff", "manager", "owner"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const accessToken = request.cookies.get("sb-access-token")?.value;

  if (pathname.startsWith("/member") || pathname.startsWith("/staff")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/staff")) {
      const {
        data: { user },
      } = await supabase.auth.getUser(accessToken);

      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || !STAFF_ROLES.includes(profile.role)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/staff/:path*"],
};
