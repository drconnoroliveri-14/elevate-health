import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WEBHOOK_URL = "https://www.elevatehealthtampa.com/api/webhooks/calendly";

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

  // Step 2: list existing webhooks (include both org AND user params)
  const listUrl = `https://api.calendly.com/webhook_subscriptions?organization=${encodeURIComponent(orgUri)}&user=${encodeURIComponent(userUri)}&scope=user`;
  console.log("[calendly setup] Listing webhooks:", listUrl);

  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listData = await listRes.json();
  console.log("[calendly setup] Webhook list response:", JSON.stringify(listData, null, 2));

  const allWebhooks: unknown[] = Array.isArray(listData.collection) ? listData.collection : [];
  const deleted: string[] = [];

  // Step 3: delete any webhook whose callback_url contains our domain
  for (const webhook of allWebhooks) {
    const w = webhook as Record<string, unknown>;
    const callbackUrl = typeof w.callback_url === "string" ? w.callback_url : "";
    if (callbackUrl.includes("elevatehealthtampa.com")) {
      const webhookUri = typeof w.uri === "string" ? w.uri : "";
      const uuid = webhookUri.split("/").pop();
      console.log("[calendly setup] Deleting webhook:", webhookUri, "uuid:", uuid);
      if (uuid) {
        const delRes = await fetch(`https://api.calendly.com/webhook_subscriptions/${uuid}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("[calendly setup] Delete status:", delRes.status);
        deleted.push(webhookUri);
      }
    }
  }

  // Step 4: wait 1 second before creating to allow Calendly to process deletions
  if (deleted.length > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Step 5: create the new webhook subscription
  const webhookRes = await fetch("https://api.calendly.com/webhook_subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      events: ["invitee.created", "invitee.canceled", "invitee_no_show.created"],
      organization: orgUri,
      user: userUri,
      scope: "user",
    }),
  });

  const webhookData = await webhookRes.json();
  console.log("[calendly setup] Create webhook status:", webhookRes.status, JSON.stringify(webhookData, null, 2));

  return NextResponse.json({
    user_uri: userUri,
    organization_uri: orgUri,
    found_webhooks: allWebhooks,
    deleted_webhook_uris: deleted,
    webhook_status: webhookRes.status,
    webhook_response: webhookData,
  });
}
