import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

const SITE_URL = "https://www.elevatehealthtampa.com";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    // PKCE flow: exchange the one-time code for a session and set cookies.
    // Build the redirect response first so cookies can be written onto it —
    // Next.js 14 Route Handler cookies() is read-only.
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
    return NextResponse.redirect(`${SITE_URL}/login?error=link_expired`);
  }

  // Legacy implicit flow: Supabase puts #access_token=...&refresh_token=...
  // in the URL hash. Hash fragments are never sent to the server, so this
  // route receives a bare request with no params. Return a minimal HTML page
  // that does a client-side redirect to /reset-password, preserving the hash
  // so the reset-password page can extract the tokens from window.location.hash.
  return new NextResponse(
    `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      var hash = window.location.hash;
      if (hash && hash.indexOf('access_token') !== -1) {
        window.location.replace('/reset-password' + hash);
      } else {
        window.location.replace('/login?error=link_expired');
      }
    </script>
  </body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
