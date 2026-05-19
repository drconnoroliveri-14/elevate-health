import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elevatehealth.com";

export async function POST(req: NextRequest) {
  let email: string | undefined;
  let fullName: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    email = typeof body.email === "string" ? body.email.toLowerCase().trim() : undefined;
    fullName = typeof body.full_name === "string" ? body.full_name.trim() : undefined;
  } catch {
    // Body is optional — proceed without it
  }

  try {
    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/`,
      ...(email && { customer_email: email }),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Capture lead so we can tie the purchase back later
    if (email) {
      await supabaseAdmin
        .from("leads")
        .upsert(
          {
            email,
            full_name: fullName ?? null,
            source: "checkout",
            purchased: false,
          },
          { onConflict: "email" }
        )
        .then(({ error }) => {
          if (error) console.error("[checkout] lead upsert:", error);
        });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}
