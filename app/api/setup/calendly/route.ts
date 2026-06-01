import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WEBHOOK_URL = "https://www.elevatehealthtampa.com/api/webhooks/calendly";

export async function GET() {
  const token = process.env.CALENDLY_API_TOKEN;
  if (!token) return NextResponse.json({ error: "CALENDLY_API_TOKEN not set" }, { status: 500 });
  const meRes = await fetch("https://api.calendly.com/users/me", { headers: { Authorization: `Bearer ${token}` } });
  const meData = await meRes.json();
  if (!meRes.ok) return NextResponse.json({ error: "Failed to fetch Calendly user", details: meData }, { status: 500 });
  const userUri: string = meData.resource?.uri;
  const orgUri: string = meData.resource?.current_organization;
  if (!userUri || !orgUri) return NextResponse.json({ error: "Missing user or organization URI", details: meData }, { status: 500 });
  const listUrl = `https://api.calendly.com/webhook_subscriptions?organization=${encodeURIComponent(orgUri)}&user=${encodeURIComponent(userUri)}&scope=user`;
  const listRes = await fetch(listUrl, { headers: { Authorization: `Bearer ${token}` } });
  const listData = await listRes.json();
  const allWebhooks: unknown[] = Array.isArray(listData.collection) ? listData.collection : [];
  const deleted: string[] = [];
  for (const webhook of allWebhooks) {
    const w = webhook as Record<string, unknown>;
    const callbackUrl = typeof w.callback_url === "string" ? w.callback_url : "";
    if (callbackUrl.includes("elevatehealthtampa.com")) {
      const webhookUri = typeof w.uri === "string" ? w.uri : "";
      const uuid = webhookUri.split("/").pop();
      if (uuid) { await fetch(`https://api.calendly.com/webhook_subscriptions/${uuid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); deleted.push(webhookUri); }
    }
  }
  if (deleted.length > 0) await new Promise((resolve) => setTimeout(resolve, 1000));
  const webhookRes = await fetch("https://api.calendly.com/webhook_subscriptions", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ url: WEBHOOK_URL, events: ["invitee.created", "invitee.canceled", "invitee_no_show.created"], organization: orgUri, user: userUri, scope: "user" }) });
  const webhookData = await webhookRes.json();
  return NextResponse.json({ user_uri: userUri, organization_uri: orgUri, found_webhooks: allWebhooks, deleted_webhook_uris: deleted, webhook_status: webhookRes.status, webhook_response: webhookData });
}