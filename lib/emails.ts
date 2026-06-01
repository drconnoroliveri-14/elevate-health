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
        <tr><td style="background:${BRAND_TEAL};padding:24px 40px;"><span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Elevate Health</span></td></tr>
        <tr><td style="padding:36px 40px;color:#374151;font-size:16px;line-height:1.7;">${body}</td></tr>
        <tr><td style="background:#f3f4f6;padding:20px 40px;text-align:center;"><p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Elevate Health · <a href="${SITE_URL}/privacy" style="color:#9ca3af;">Privacy</a> · <a href="${SITE_URL}/terms" style="color:#9ca3af;">Terms</a></p></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(text: string, url: string) {
  return `<p style="margin:28px 0 0;"><a href="${url}" style="background:${BRAND_TEAL};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:10px;display:inline-block;">${text}</a></p>`;
}

export function welcomeEmail({ firstName, email, tempPassword }: { firstName: string; email: string; tempPassword: string }) {
  const loginUrl = `${SITE_URL}/login`;
  return {
    subject: "Welcome to the Elevate Pain-Free Program — Your login details inside",
    html: wrap(`
      <p>Hey ${firstName || "there"}, congratulations and welcome to the <strong>Elevate Pain-Free Program</strong>!</p>
      <p>You now have full access to all 7 rehabilitation modules. Start with Module 1 today.</p>
      <table style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;width:100%;box-sizing:border-box;margin:24px 0;">
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Login URL:</strong> <a href="${loginUrl}" style="color:${BRAND_TEAL};">${loginUrl}</a></td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Email:</strong> ${email}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Temporary Password:</strong> <code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;">${tempPassword}</code></td></tr>
      </table>
      <p style="font-size:13px;color:#6b7280;"><em>Please change your password after your first login.</em></p>
      <p>Remember: you're backed by a <strong>90-day pain-free guarantee</strong>.</p>
      ${btn("Start Module 1 →", `${SITE_URL}/dashboard/module/1`)}
      <p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>
    `),
    text: `Welcome to the Elevate Pain-Free Program!\n\nLogin URL: ${loginUrl}\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nPlease change your password after your first login.`,
  };
}

export function day3Email(firstName: string) {
  return {
    subject: "Day 3 check-in — how is your pain today?",
    html: wrap(`<p>Hey ${firstName || "there"},</p><p>You're 3 days into the Elevate Pain-Free Program — how are you feeling?</p><p>If you haven't finished Module 1 yet, make that your priority today.</p>${btn("Continue Module 1 →", `${SITE_URL}/dashboard/module/1`)}<p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>`),
    text: `Hey ${firstName || "there"}, you're 3 days in! Continue at ${SITE_URL}/dashboard`,
  };
}

export function day14Email(firstName: string) {
  return {
    subject: "2 weeks in — most students feel significant relief by now",
    html: wrap(`<p>Hey ${firstName || "there"},</p><p>Two weeks into the Elevate Pain-Free Program — this is where most students start noticing real improvement.</p>${btn("Continue Your Program →", `${SITE_URL}/dashboard`)}<p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>`),
    text: `Hey ${firstName || "there"}, 2 weeks in! Continue at ${SITE_URL}/dashboard`,
  };
}

export function day30Email(firstName: string) {
  return {
    subject: "30 days — you're building a pain-free habit",
    html: wrap(`<p>Hey ${firstName || "there"},</p><p>30 days in — you're building a real habit. Keep going!</p>${btn("Continue Your Program →", `${SITE_URL}/dashboard`)}<p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>`),
    text: `Hey ${firstName || "there"}, 30 days in! Continue at ${SITE_URL}/dashboard`,
  };
}

export function day90Email(firstName: string) {
  return {
    subject: "90 days — are you pain-free?",
    html: wrap(`<p>Hey ${firstName || "there"},</p><p>90 days. That's a milestone worth celebrating.</p><p>If you've followed the program and you're not completely satisfied, your <strong>90-day pain-free guarantee</strong> is still active.</p>${btn("Return to Your Program →", `${SITE_URL}/dashboard`)}<p>Thank you for trusting us with your recovery.<br><strong>The Elevate Health Team</strong></p>`),
    text: `Hey ${firstName || "there"}, 90 days! Return to ${SITE_URL}/dashboard`,
  };
}
