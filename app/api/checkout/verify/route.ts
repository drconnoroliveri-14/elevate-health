import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { valid: false, error: "Missing session_id." },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        valid: true,
        customerEmail: session.customer_details?.email ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[checkout/verify] Stripe error:", err);
    return NextResponse.json(
      { valid: false, error: "Could not verify session." },
      { status: 500 }
    );
  }
}
