// IMPORTANT: STRIPE_PRICE_ID env var must point to a $97 product in Stripe dashboard.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const successUrl =
    "https://www.elevatehealthtampa.com/success?session_id={CHECKOUT_SESSION_ID}";
  const cancelUrl = "https://www.elevatehealthtampa.com";

  let email: string | undefined;
  let fullName: string | undefined;

  let upsells: string[] = [];

  try {
    const body = await req.json().catch(() => ({}));
    email =
      typeof body.email === "string"
        ? body.email.toLowerCase().trim()
        : undefined;
    fullName =
      typeof body.full_name === "string" ? body.full_name.trim() : undefined;
    upsells = Array.isArray(body.upsells) ? body.upsells : [];
  } catch {
    // Body is optional — proceed without it
  }

  const lineItems: { price: string; quantity: number }[] = [
    { price: process.env.STRIPE_PRICE_ID!, quantity: 1 },
  ];
  if (upsells.includes("upsell1") && process.env.STRIPE_UPSELL_1_PRICE_ID) {
    lineItems.push({ price: process.env.STRIPE_UPSELL_1_PRICE_ID, quantity: 1 });
  }
  if (upsells.includes("upsell2") && process.env.STRIPE_UPSELL_2_PRICE_ID) {
    lineItems.push({ price: process.env.STRIPE_UPSELL_2_PRICE_ID, quantity: 1 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
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
