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
    subject: "The real reason your back pain keeps coming back",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Most people treat back and neck pain by chasing symptoms — pain pills, heat packs, occasional stretching. It helps for a day or two. Then the pain returns.</p>
      <p>Here's why: <strong>symptoms are not the problem. The root causes are.</strong></p>
      <p>Chronic neck and back pain almost always comes down to three things: poor posture, muscle imbalances, and faulty movement patterns. Until those are addressed, the pain will keep coming back — no matter how many times you treat the symptoms.</p>
      <p>The Elevate Pain-Free Program is built around addressing these root causes directly. It's the same approach used by physical therapists — now available as a complete at-home system.</p>
      <p>To your recovery,<br><strong>The Elevate Health Team</strong></p>
      ${btn("Explore the Program →", `${SITE_URL}/#enroll`)}
    `),
  };
}

export function nurtureEmail2(firstName: string) {
  return {
    subject: "3 exercises that eliminate neck pain (physical therapist approved)",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Here are 3 exercises physical therapists use to eliminate neck pain fast:</p>
      <ol style="padding-left:20px;line-height:2.2;">
        <li><strong>Chin Tucks</strong> — Gently retract your chin straight back (not down). Hold 5 seconds. Repeat 10 times. This resets cervical alignment and releases deep neck tension.</li>
        <li><strong>Thoracic Extension</strong> — Sit at the edge of a chair, interlace fingers behind your head, and gently arch backwards over the backrest. Hold 3 seconds. Repeat 8 times. This opens the upper back and takes pressure off the neck.</li>
        <li><strong>Hip Flexor Stretch</strong> — Kneel on one knee, push hips forward gently, hold 30 seconds each side. Tight hip flexors pull the pelvis forward and cause a chain reaction all the way up to the neck.</li>
      </ol>
      <p>These 3 exercises are just a preview of what's inside Module 2 of the Elevate Pain-Free Program. The full protocol goes much deeper.</p>
      <p>To your recovery,<br><strong>The Elevate Health Team</strong></p>
      ${btn("See the Full Program →", `${SITE_URL}/#enroll`)}
    `),
  };
}

export function nurtureEmail3(firstName: string) {
  return {
    subject: "Michael eliminated 6 years of back pain in 8 weeks. Here's how.",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Michael R. had chronic lower back pain for 6 years. He tried everything — chiropractic, massage, painkillers, even a cortisone injection. Nothing gave him lasting relief.</p>
      <p>When he found the Elevate Pain-Free Program, he was skeptical. <em>"I'd tried so many things, I didn't think anything would actually work,"</em> he told us.</p>
      <p>But he committed to the program anyway. He worked through the modules, did the exercises every day, and followed the 90-day protocol.</p>
      <p>Eight weeks later, Michael was completely pain-free. His words: <em>"I can't believe I waited this long. I feel like I have my life back."</em></p>
      <p>Michael's results aren't magic. They're the result of addressing the <em>actual root causes</em> of his pain — something most treatments never do.</p>
      <p>If you're ready for the same result, the program is waiting for you.</p>
      ${btn("Join the Elevate Pain-Free Program →", `${SITE_URL}/#enroll`)}
      <p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function nurtureEmail4(firstName: string) {
  return {
    subject: "Why surgery and painkillers don't fix back pain",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Here's an uncomfortable truth about back pain treatment:</p>
      <p><strong>Spinal surgery fails to relieve pain in over 50% of cases</strong> for non-specific back pain. There's even a medical term for it: Failed Back Surgery Syndrome.</p>
      <p>Painkillers and anti-inflammatories mask the symptoms — but the underlying cause remains untreated. The moment the medication wears off, the pain returns. Often worse.</p>
      <p>The only proven long-term solution for non-specific neck and back pain is <strong>targeted rehabilitation</strong>: correcting posture, rebalancing muscles, and retraining movement patterns. This is exactly what the Elevate Pain-Free Program delivers.</p>
      <p>The 90-day guarantee means there's zero risk. If you're not pain-free, you pay nothing.</p>
      <p>Don't wait another week to start feeling better.</p>
      ${btn("Join the Elevate Pain-Free Program → $497", `${SITE_URL}/#enroll`)}
      <p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function nurtureEmail5(firstName: string) {
  return {
    subject: "Last chance — your Free Back Pain Relief Guide is waiting",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>You downloaded the Free Back Pain Relief Guide a little while ago. I hope it's been helpful.</p>
      <p>If you're serious about ending your pain for good, the full Elevate Pain-Free Program has everything you need:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>7 evidence-based rehabilitation modules</li>
        <li>90-day personal pain-free protocol</li>
        <li>Pain Tracking Journal ($97 value)</li>
        <li>Posture Correction Quick Reference Guide ($67 value)</li>
        <li>Lifetime access + all future updates</li>
        <li>90-day pain-free guarantee — full refund if you're not satisfied</li>
      </ul>
      <p>Total value: <strong>$661</strong>. Your investment: <strong>$497</strong>.</p>
      <p>The 90-day guarantee removes all risk. If you follow the program and aren't completely satisfied with your results, you get every penny back. No questions asked.</p>
      ${btn("Join the Elevate Pain-Free Program →", `${SITE_URL}/#enroll`)}
      <p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>
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
    subject: "Welcome to the Elevate Pain-Free Program — Your login details inside",
    html: wrap(`
      <p>Hey ${firstName || "there"}, congratulations and welcome to the <strong>Elevate Pain-Free Program</strong>!</p>
      <p>You now have full access to all 7 rehabilitation modules. Start with Module 1 today — understanding your pain is the foundation for everything that follows.</p>
      <p>Your login details are below:</p>
      <table style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;width:100%;box-sizing:border-box;margin:24px 0;">
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Login URL:</strong> <a href="${loginUrl}" style="color:${BRAND_TEAL};">${loginUrl}</a></td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Email:</strong> ${email}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Temporary Password:</strong> <code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;">${tempPassword}</code></td></tr>
      </table>
      <p style="font-size:13px;color:#6b7280;"><em>Please change your password after your first login.</em></p>
      <p>Remember: you're backed by a <strong>90-day pain-free guarantee</strong>. If you follow the program and aren't completely satisfied with your results, we'll refund every penny — no questions asked.</p>
      ${btn("Start Module 1 →", `${SITE_URL}/dashboard/module/1`)}
      <p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function day3Email(firstName: string) {
  return {
    subject: "Day 3 check-in — how is your pain today?",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>You're 3 days into the Elevate Pain-Free Program — how are you feeling?</p>
      <p>Many students notice the first signs of relief within the first week. Don't be discouraged if you haven't yet — your body is just starting to respond to the correct stimulus.</p>
      <p>If you haven't finished Module 1 yet, make that your priority today. Understanding the root causes of your pain is the foundation for everything that follows.</p>
      <p><strong>Pro tip:</strong> Do your exercises at the same time each day. Consistency matters more than perfection. Even 15–20 minutes at the same time every morning will produce dramatically better results than sporadic longer sessions.</p>
      ${btn("Continue Module 1 →", `${SITE_URL}/dashboard/module/1`)}
      <p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function day14Email(firstName: string) {
  return {
    subject: "2 weeks in — most students feel significant relief by now",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Two weeks into the Elevate Pain-Free Program — this is where most students start noticing real, meaningful improvement in their pain levels.</p>
      <p>How are you doing? Hit reply and let us know — we read every response.</p>
      <p>If you haven't already, make sure you're using your <strong>Pain Tracking Journal</strong> (included in your program). Tracking your daily pain levels is one of the most powerful things you can do to stay motivated and on track — you'll often notice progress you'd otherwise miss.</p>
      <p>Remember Michael R.? He had chronic lower back pain for 6 years. By week 2 he was already noticing improvement. By week 8 he was completely pain-free. You can get there too.</p>
      ${btn("Continue Your Program →", `${SITE_URL}/dashboard`)}
      <p style="margin-top:28px;">To your recovery,<br><strong>The Elevate Health Team</strong></p>
    `),
  };
}

export function day90Email(firstName: string) {
  return {
    subject: "90 days — are you pain-free?",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>90 days. That's a milestone worth celebrating.</p>
      <p>We'd love to know: how is your pain today compared to when you started? Hit reply and tell us — we read every message and your story genuinely matters to us.</p>
      <p>If you've followed the program and you're not completely satisfied with your results, remember that your <strong>90-day pain-free guarantee</strong> is still active. Just reply to this email and we'll process your full refund — no questions asked.</p>
      <p>And if you are pain-free — congratulations. That result is yours forever. Use the maintenance protocol in <strong>Module 7</strong> to keep your spine strong and prevent pain from returning.</p>
      <p>Thank you for trusting us with your recovery.<br><strong>The Elevate Health Team</strong></p>
      ${btn("Return to Your Program →", `${SITE_URL}/dashboard`)}
    `),
  };
}
