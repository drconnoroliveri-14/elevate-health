const BRAND_TEAL = "#0F6E56";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elevatehealth.com";

function wrap(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
        <tr>
          <td style="background:${BRAND_TEAL};padding:24px 40px;">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Elevate Health</span>
          </td>
        </tr>
        <tr><td style="padding:36px 40px;color:#374151;font-size:16px;line-height:1.7;">
          ${body}
        </td></tr>
        <tr>
          <td style="background:#f3f4f6;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} Elevate Health ·
              <a href="${SITE_URL}/privacy" style="color:#9ca3af;">Privacy</a> ·
              <a href="${SITE_URL}/terms" style="color:#9ca3af;">Terms</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(text: string, url: string) {
  return `<p style="margin:28px 0 0;">
    <a href="${url}" style="background:${BRAND_TEAL};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:10px;display:inline-block;">${text}</a>
  </p>`;
}

// ── Pre-purchase nurture ───────────────────────────────────────────────────────

export function nurtureEmail1(firstName: string) {
  return {
    subject: "Your free longevity guide is inside",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Here's your free <strong>Longevity Quickstart Guide</strong>. It covers the 5 biomarkers most doctors never test — and what each one means for how fast you're actually aging.</p>
      <p>The full Elevate Longevity Program goes 10x deeper. I'll share more over the next few days.</p>
      <p>To your health,<br><strong>The Elevate Health Team</strong></p>
      ${btn("Explore the Program →", `${SITE_URL}/#enroll`)}
    `),
  };
}

export function nurtureEmail2(firstName: string) {
  return {
    subject: "The aging myth that's quietly costing you years",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Most people believe aging is genetic.</p>
      <p>Here's what the science actually says: <strong>up to 80% of how you age is determined by lifestyle</strong> — not DNA.</p>
      <p>Tomorrow I'll share the #1 longevity predictor that almost nobody tracks.</p>
      <p>To your health,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function nurtureEmail3(firstName: string) {
  return {
    subject: "The #1 longevity predictor (it's probably not what you think)",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>It's not diet. It's not sleep. It's not even stress.</p>
      <p>The single strongest predictor of how long you'll live is your <strong>VO2 max</strong>. People in the top 25% have a 5× lower risk of early death.</p>
      <p>Module 3 of the Elevate Longevity Program is entirely dedicated to building yours.</p>
      ${btn("Join the Program →", `${SITE_URL}/#enroll`)}
    `),
  };
}

export function nurtureEmail4(firstName: string) {
  return {
    subject: "David reversed 8 years of biological age. Here's how.",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>David came to us at 54 feeling like 70. Six months later his biological age test showed he'd reversed 8 years.</p>
      <p>He followed the 7-module protocol step by step. His words: <em>"I feel better at 54 than I did at 40."</em></p>
      <p>Ready for your own reset?</p>
      ${btn("Join the Elevate Longevity Program → $997", `${SITE_URL}/#enroll`)}
    `),
  };
}

export function nurtureEmail5(firstName: string) {
  return {
    subject: "Everything you get (and why now)",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Here's everything inside the Elevate Longevity Program:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>7 science-backed video modules</li>
        <li>90-day personal protocol</li>
        <li>Biomarker Tracking Spreadsheet ($197 value)</li>
        <li>Supplement Stack Reference Guide ($97 value)</li>
        <li>Lifetime access + all future updates</li>
        <li>90-day money-back guarantee</li>
      </ul>
      <p>Total value: <strong>$1,500+</strong>. Your investment: <strong>$997</strong>.</p>
      <p>Enrollment closes soon.</p>
      ${btn("Join Now →", `${SITE_URL}/#enroll`)}
    `),
  };
}

// ── Post-purchase sequence ────────────────────────────────────────────────────

export function welcomeEmail({
  firstName,
  email,
  tempPassword,
}: {
  firstName: string;
  email: string;
  tempPassword: string;
}) {
  const loginUrl = `${SITE_URL}/login`;
  return {
    subject: "You're in! Here's how to get started",
    html: wrap(`
      <p>Welcome to the <strong>Elevate Longevity Program</strong>!</p>
      <p>Your login details are below. Module 1 is unlocked and ready. A new module will unlock every 7 days as you progress through the program.</p>
      <table style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;width:100%;box-sizing:border-box;margin:24px 0;">
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Login URL:</strong> <a href="${loginUrl}" style="color:${BRAND_TEAL};">${loginUrl}</a></td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Email:</strong> ${email}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Temporary Password:</strong> <code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;">${tempPassword}</code></td></tr>
      </table>
      <p style="font-size:13px;color:#6b7280;"><em>Please change your password after your first login.</em></p>
      ${btn("Start Module 1 →", `${SITE_URL}/dashboard/module/1`)}
      <p style="margin-top:28px;">To your longevity,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function day3Email(firstName: string) {
  return {
    subject: "How's Module 1 going?",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Just checking in — how are you finding Module 1: <strong>The Science of Aging</strong>?</p>
      <p>Once you complete Module 1 and it's been 7 days since you first accessed it, Module 2 (Nutrition for Longevity) will automatically unlock.</p>
      <p>Take your time — the most important thing is to actually implement what you learn, not to rush through the content.</p>
      ${btn("Continue to Module 1 →", `${SITE_URL}/dashboard/module/1`)}
      <p style="margin-top:28px;">To your health,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function day14Email(firstName: string) {
  return {
    subject: "Want to go deeper? A personal offer for you",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>You've been working through the Elevate Longevity Program for 2 weeks now — incredible commitment.</p>
      <p>For students who want to go further faster, we offer <strong>private 1-on-1 coaching calls</strong> with our longevity experts. In 60 minutes, we'll review your biomarkers, personalise your protocol, and answer every question you have.</p>
      <p><strong>Investment: $497</strong> — one call, unlimited impact.</p>
      ${btn("Book Your Coaching Call →", "https://calendly.com/elevatehealth/coaching-placeholder")}
      <p style="margin-top:28px;">To your longevity,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function day90Email(firstName: string) {
  return {
    subject: "90 days in — how do you feel?",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>It's been 90 days since you joined the Elevate Longevity Program. That's 90 days of intentional investment in your health.</p>
      <p>We'd love to hear your story. <strong>Could you take 2 minutes to leave a review?</strong> Your experience helps others who are on the fence make the decision that could change their life.</p>
      <p>As a thank-you, here's a <strong>unique 20% off referral link</strong> you can share with anyone you think would benefit from the program.</p>
      <p style="font-size:13px;color:#6b7280;">Referral link: <a href="${SITE_URL}/?ref=${firstName?.toLowerCase().replace(/\s+/g, "-") || "friend"}" style="color:${BRAND_TEAL};">${SITE_URL}/?ref=you</a></p>
      ${btn("Leave a Review →", `${SITE_URL}/?review=1`)}
      <p style="margin-top:28px;">Thank you for trusting us with your health.<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}
