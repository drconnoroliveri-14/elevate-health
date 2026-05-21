// IMPORTANT: STRIPE_PRICE_ID env var must point to a $97 product in Stripe dashboard.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const successUrl =
    "https://elevate-health-lyart.vercel.app/success?session_id={CHECKOUT_SESSION_ID}";
  const cancelUrl = "https://elevate-health-lyart.vercel.app";

  let email: string | undefined;
  let fullName: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    email =
      typeof body.email === "string"
        ? body.email.toLowerCase().trim()
        : undefined;
    fullName =
      typeof body.full_name === "string" ? body.full_name.trim() : undefined;
  } catch {
    // Body is optional — proceed without it
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(email && { customer_email: email }),
    });

    if (email) {
      supabaseAdmin
        .from("leads")
        .upsert(
          { email, full_name: fullName ?? null, source: "checkout", purchased: false },
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
