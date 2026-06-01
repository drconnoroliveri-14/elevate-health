import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

const SITE_URL = "https://www.elevatehealthtampa.com";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (code) {
    const response = NextResponse.redirect(`${SITE_URL}/reset-password`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => req.cookies.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
    console.error("[auth/callback] Code exchange failed:", error);
    return NextResponse.redirect(`${SITE_URL}/login?error=link_expired`);
  }
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body><script>var hash = window.location.hash; if (hash && hash.indexOf('access_token') !== -1) { window.location.replace('/reset-password' + hash); } else { window.location.replace('/login?error=link_expired'); }</script></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}