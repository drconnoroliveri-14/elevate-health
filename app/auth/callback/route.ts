import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

const SITE_URL = "https://elevate-health-lyart.vercel.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    // Create the redirect response first so we can set cookies on it.
    // In Next.js 14 Route Handlers, cookies() from next/headers is read-only;
    // session cookies must be written onto the Response object directly.
    const response = NextResponse.redirect(`${SITE_URL}/reset-password`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
    console.error("[auth/callback] Code exchange failed:", error);
  }

  return NextResponse.redirect(`${SITE_URL}/login?error=link_expired`);
}
