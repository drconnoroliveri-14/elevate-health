import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.CALENDLY_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "CALENDLY_API_TOKEN not set" }, { status: 500 });
  }

  // Step 1: get the current user
  const meRes = await fetch("https://api.calendly.com/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();

  if (!meRes.ok) {
    return NextResponse.json({ error: "Failed to fetch Calendly user", details: meData }, { status: 500 });
  }

  const userUri: string = meData.resource?.uri;
  const orgUri: string = meData.resource?.current_organization;

  if (!userUri || !orgUri) {
    return NextResponse.json({ error: "Missing user or organization URI", details: meData }, { status: 500 });
  }

  // Step 2: create the webhook subscription
  const webhookRes = await fetch("https://api.calendly.com/webhook_subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://www.elevatehealthtampa.com/api/webhooks/calendly",
      events: ["invitee.created", "invitee.canceled", "invitee_no_show.created"],
      organization: orgUri,
      user: userUri,
      scope: "user",
    }),
  });

  const webhookData = await webhookRes.json();

  return NextResponse.json({
    user_uri: userUri,
    organization_uri: orgUri,
    webhook_status: webhookRes.status,
    webhook_response: webhookData,
  });
}
