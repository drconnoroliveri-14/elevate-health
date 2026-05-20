import Stripe from "stripe";

// Lazy singleton — initialised at first call so build-time module
// evaluation doesn't fail when STRIPE_SECRET_KEY is not set.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// Named re-export so existing imports keep working as a getter.
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop: string) {
    return getStripe()[prop as keyof Stripe];
  },
});
