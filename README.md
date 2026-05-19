# Elevate Health — Elevate Longevity Program

A production-ready full-stack web application for the **Elevate Longevity Program** — a $997 online video course delivered via a drip-based course portal.

**Stack:** Next.js 14 (App Router) · Tailwind CSS · Supabase · Stripe · Resend · Vercel

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Stripe Setup](#stripe-setup)
4. [Resend Setup](#resend-setup)
5. [Environment Variables](#environment-variables)
6. [Local Development](#local-development)
7. [Vercel Deployment](#vercel-deployment)

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account
- A [Vercel](https://vercel.com) account (for deployment)

---

## Supabase Setup

### 1. Create a project

1. Go to [supabase.com](https://supabase.com) and click **New project**.
2. Choose a name (e.g. `elevate-health`), set a strong database password, and pick a region close to your users.
3. Wait for the project to finish provisioning (~2 minutes).

### 2. Run the SQL schema

1. In your Supabase project, navigate to **SQL Editor**.
2. Click **New query**.
3. Paste the entire contents of `supabase-schema.sql` (in the project root).
4. Click **Run** (Ctrl+Enter).

This creates four tables — `profiles`, `leads`, `module_progress`, `email_log` — with Row Level Security policies applied.

### 3. Get your API keys

1. Go to **Project Settings → API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configure Auth

1. Go to **Authentication → Providers** and ensure **Email** is enabled.
2. Under **Authentication → URL Configuration**, set:
   - **Site URL**: `https://your-domain.vercel.app`
   - **Redirect URLs**: add `https://your-domain.vercel.app/dashboard`

---

## Stripe Setup

### 1. Create the product and price

1. In the Stripe Dashboard, go to **Products → Add product**.
2. Set:
   - **Name**: Elevate Longevity Program
   - **Pricing model**: One-time
   - **Price**: $997.00 USD
3. Save and copy the **Price ID** (starts with `price_…`) → `STRIPE_PRICE_ID`

### 2. Set up the webhook

1. Go to **Developers → Webhooks → Add endpoint**.
2. **Endpoint URL**: `https://your-domain.vercel.app/api/webhooks/stripe`
3. **Events to listen to**: select `checkout.session.completed`
4. Click **Add endpoint**.
5. Copy the **Signing secret** (starts with `whsec_…`) → `STRIPE_WEBHOOK_SECRET`

### 3. Get your secret key

1. Go to **Developers → API keys**.
2. Copy the **Secret key** (starts with `sk_live_…` or `sk_test_…`) → `STRIPE_SECRET_KEY`

> **Tip:** Use `sk_test_…` keys and Stripe's test card `4242 4242 4242 4242` during development.

### Local webhook testing

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This prints a local signing secret — use it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Resend Setup

### 1. Create an account and verify your domain

1. Sign up at [resend.com](https://resend.com).
2. Go to **Domains → Add Domain** and enter the domain you'll send from (e.g. `mail.elevatehealth.com`).
3. Add the DNS records shown to your DNS provider and click **Verify**.

### 2. Create an API key

1. Go to **API Keys → Create API Key**.
2. Give it a name (e.g. `elevate-health-prod`), set permissions to **Full access**.
3. Copy the key → `RESEND_API_KEY`

> Update the `from` address in `/app/api/webhooks/stripe/route.ts` and the email sequence files to use your verified domain.

---

## Environment Variables

Copy `.env.local` and fill in all values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set `NEXT_PUBLIC_SITE_URL` to your live domain (e.g. `https://elevatehealth.com`).

---

## Local Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For Stripe webhook testing, run the Stripe CLI in a second terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial production build"
git push origin main
```

### 2. Import the project

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import your GitHub repository.
3. Vercel detects Next.js automatically — leave framework preset as **Next.js**.

### 3. Add environment variables

In the Vercel project settings under **Environment Variables**, add every key from `.env.local` with your production values. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain.

### 4. Deploy

Click **Deploy**. Vercel builds and deploys your app. Subsequent pushes to `main` trigger automatic redeployments.

### 5. Update Stripe & Supabase with live URL

After your first deploy:
- Update the Stripe webhook endpoint URL to your Vercel domain.
- Update the Supabase Auth **Site URL** and **Redirect URLs** to your Vercel domain.

---

## Project Structure

```
elevate-health/
├── app/
│   ├── page.tsx                      # / — Landing page
│   ├── checkout/page.tsx             # /checkout
│   ├── success/page.tsx              # /success
│   ├── login/page.tsx                # /login
│   ├── dashboard/page.tsx            # /dashboard — Student portal
│   ├── admin/page.tsx                # /admin — Admin dashboard
│   ├── privacy/page.tsx              # /privacy
│   ├── terms/page.tsx                # /terms
│   └── api/
│       ├── checkout/route.ts         # POST — create Stripe Checkout session
│       ├── webhooks/stripe/route.ts  # POST — Stripe webhook handler
│       ├── modules/
│       │   ├── access/route.ts       # POST — log module access, unlock next
│       │   └── complete/route.ts     # POST — mark module complete
│       └── admin/stats/route.ts      # GET — admin metrics
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── resend.ts
├── types/index.ts
├── supabase-schema.sql
└── .env.local
```

---

## 90-Day Money-Back Guarantee

The site advertises a **90-day full money-back guarantee**. To process refunds, use the Stripe Dashboard or automate via the Stripe API.

## Support

For technical issues, open an issue in the repository or contact the development team.
