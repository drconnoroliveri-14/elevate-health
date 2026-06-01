import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
const BASE_URL = "https://www.elevatehealthtampa.com";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => cookieStore.getAll() } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const upgrade: string = body.upgrade;
  if (upgrade !== "nutrition" && upgrade !== "consultation" && upgrade !== "consultation_rebooking") return NextResponse.json({ error: "Invalid upgrade type." }, { status: 400 });
  const { data: profileRows } = await supabaseAdmin.from("profiles").select("email, has_nutrition_course, has_consultation").eq("id", user.id).limit(1);
  const profile = profileRows?.[0];
  if (upgrade === "nutrition" && profile?.has_nutrition_course) return NextResponse.json({ error: "You already have the Nutrition Course." }, { status: 400 });
  if (upgrade === "consultation" && profile?.has_consultation) return NextResponse.json({ error: "You already have a Consultation." }, { status: 400 });
  if (upgrade === "consultation_rebooking") {
    const priceId = process.env.STRIPE_UPSELL_2_PRICE_ID!;
    if (!priceId) return NextResponse.json({ error: "Price not configured." }, { status: 500 });
    try {
      const session = await stripe.checkout.sessions.create({ mode: "payment", line_items: [{ price: priceId, quantity: 1 }], customer_email: profile?.email ?? user.email ?? undefined, success_url: `${BASE_URL}/dashboard/consultation/rebooking-success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${BASE_URL}/dashboard/consultation`, metadata: { userId: user.id, upgrade: "consultation_rebooking", source: "dashboard_rebooking" } });
      return NextResponse.json({ url: session.url });
    } catch (err) { console.error("[upgrades/checkout] Stripe error (rebooking):", err); return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 }); }
  }
  const priceId = upgrade === "nutrition" ? process.env.STRIPE_UPSELL_1_PRICE_ID! : process.env.STRIPE_UPSELL_2_PRICE_ID!;
  if (!priceId) return NextResponse.json({ error: "Price not configured." }, { status: 500 });
  try {
    const session = await stripe.checkout.sessions.create({ mode: "payment", line_items: [{ price: priceId, quantity: 1 }], customer_email: profile?.email ?? user.email ?? undefined, success_url: `${BASE_URL}/dashboard/upgrades/success?upgrade=${upgrade}&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${BASE_URL}/dashboard/upgrades`, metadata: { userId: user.id, upgrade, source: "dashboard_upgrade" } });
    return NextResponse.json({ url: session.url });
  } catch (err) { console.error("[upgrades/checkout] Stripe error:", err); return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 }); }
}