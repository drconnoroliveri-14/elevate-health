import { Resend } from "resend";

// Lazy singleton — avoids build-time errors when RESEND_API_KEY is not set.
let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_t, prop: string) {
    return getResend()[prop as keyof Resend];
  },
});
