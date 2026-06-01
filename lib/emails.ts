const BRAND_TEAL = "#0F6E56";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.elevatehealthtampa.com";

const NURTURE_UNSUB_HTML = `<p style="font-size:12px;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">You received this email because you requested our free Back Pain Relief Guide. To unsubscribe reply with UNSUBSCRIBE in the subject line.</p>`;
const NURTURE_UNSUB_TEXT = `\n\n---\nYou received this email because you requested our free Back Pain Relief Guide. To unsubscribe reply with UNSUBSCRIBE in the subject line.`;

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

// ── Pre-purchase nurture ───────────────────────────────────────────────────────

export function nurtureEmail1(firstName: string) {
  return {
    subject: "Your Back Pain Relief Guide is ready",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Here is your <strong>Back Pain Relief Guide</strong>.</p>
      <p>It covers the 3 root causes of chronic neck and back pain — and why most people never fix them.</p>
      <p style="text-align:center;margin:28px 0;">
        <a href="${SITE_URL}/back-pain-guide" style="background:#0F6E56;color:#fff;padding:16px 36px;border-radius:10px;text-decoration:none;font-weight:800;font-size:16px;display:inline-block;line-height:1.3;">
          Access Your Back Pain Relief Guide →
        </a>
      </p>
      <p style="text-align:center;color:#6b7280;font-size:13px;margin:-12px 0 24px;">
        Click the button above, then use <strong>Print → Save as PDF</strong> to save it to your device.
      </p>
      <p>The full <strong>Elevate Pain-Free Program</strong> goes 10x deeper with 7 chiropractic care modules you can do at home in just 20 minutes a day.</p>
      <p>I will share more over the next few days.</p>
      <p>To your health,<br>Dr. Connor Oliveri, DC<br>Elevate Health</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/#enroll" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          See the Full Program — $97 Today
        </a>
      </p>
      ${NURTURE_UNSUB_HTML}
    `),
    text: `Hey ${firstName || "there"},

Here is your Back Pain Relief Guide.

It covers the 3 root causes of chronic neck and back pain — and why most people never fix them.

Access your guide here: ${SITE_URL}/back-pain-guide
(Open the link, then use Print → Save as PDF to save it to your device.)

The full Elevate Pain-Free Program goes 10x deeper with 7 chiropractic care modules you can do at home in just 20 minutes a day.

I will share more over the next few days.

To your health,
Dr. Connor Oliveri, DC
Elevate Health

See the Full Program — $97 Today: ${SITE_URL}/#enroll
${NURTURE_UNSUB_TEXT}`,
  };
}

export function nurtureEmail2(firstName: string) {
  return {
    subject: "The real reason your back pain keeps coming back",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Most people treat back pain with rest, painkillers, or the same stretches over and over.</p>
      <p>None of that fixes the root cause.</p>
      <p>The real reason your pain keeps returning is <strong>muscle imbalances and movement pattern dysfunction</strong> — and until you fix those, the pain always comes back.</p>
      <p>Tomorrow I will share the single most effective exercise for lower back pain relief.</p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/#enroll" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Fix the Root Cause — $97 Today
        </a>
      </p>
      ${NURTURE_UNSUB_HTML}
    `),
    text: `Hey ${firstName || "there"},

Most people treat back pain with rest, painkillers, or the same stretches over and over.

None of that fixes the root cause.

The real reason your pain keeps returning is muscle imbalances and movement pattern dysfunction — and until you fix those, the pain always comes back.

Tomorrow I will share the single most effective exercise for lower back pain relief.

To your health,
Dr. Connor Oliveri
Elevate Health

Fix the Root Cause — $97 Today: ${SITE_URL}/#enroll
${NURTURE_UNSUB_TEXT}`,
  };
}

export function nurtureEmail3(firstName: string) {
  return {
    subject: "The best exercise for lower back pain (most people never do this)",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>It is not crunches. It is not stretching.</p>
      <p>The single most effective exercise for lower back pain is the <strong>McGill Curl-Up</strong> — developed by spine biomechanics expert Dr. Stuart McGill.</p>
      <p>It activates deep core muscles that stabilize your lumbar spine without putting pressure on your discs.</p>
      <p>Module 4 of the Elevate Pain-Free Program walks you through the complete McGill protocol step by step.</p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/#enroll" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Get the Full Protocol — $97 Today
        </a>
      </p>
      ${NURTURE_UNSUB_HTML}
    `),
    text: `Hey ${firstName || "there"},

It is not crunches. It is not stretching.

The single most effective exercise for lower back pain is the McGill Curl-Up — developed by spine biomechanics expert Dr. Stuart McGill.

It activates deep core muscles that stabilize your lumbar spine without putting pressure on your discs.

Module 4 of the Elevate Pain-Free Program walks you through the complete McGill protocol step by step.

To your health,
Dr. Connor Oliveri
Elevate Health

Get the Full Protocol — $97 Today: ${SITE_URL}/#enroll
${NURTURE_UNSUB_TEXT}`,
  };
}

export function nurtureEmail4(firstName: string) {
  return {
    subject: "Michael avoided back surgery. Here is his story.",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Michael came to us at 52 with 6 years of chronic lower back pain. His doctor had recommended surgery.</p>
      <p>Instead he followed the Elevate Pain-Free Program for 8 weeks.</p>
      <p>His words: <em>"I am completely pain-free. No surgery, no medication, just the program."</em></p>
      <p>Ready for your own results?</p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/#enroll" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Join the Elevate Pain-Free Program — $97 Today
        </a>
      </p>
      ${NURTURE_UNSUB_HTML}
    `),
    text: `Hey ${firstName || "there"},

Michael came to us at 52 with 6 years of chronic lower back pain. His doctor had recommended surgery.

Instead he followed the Elevate Pain-Free Program for 8 weeks.

His words: "I am completely pain-free. No surgery, no medication, just the program."

Ready for your own results?

To your health,
Dr. Connor Oliveri
Elevate Health

Join the Elevate Pain-Free Program — $97 Today: ${SITE_URL}/#enroll
${NURTURE_UNSUB_TEXT}`,
  };
}

export function nurtureEmail5(firstName: string) {
  return {
    subject: "Inside the Elevate Pain-Free Program",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Here is everything inside the <strong>Elevate Pain-Free Program</strong>:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>7 chiropractic care video modules</li>
        <li>90-day personal rehab protocol</li>
        <li>Pain Tracking Journal ($47 value)</li>
        <li>Posture Correction Quick Reference Guide ($37 value)</li>
        <li>Lifetime access and all future updates</li>
        <li>90-day money-back guarantee</li>
      </ul>
      <p><strong>Total value: $297. Your investment today: $97.</strong></p>
      <p>Enrollment closes soon.</p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/#enroll" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Get Instant Access — $97
        </a>
      </p>
      ${NURTURE_UNSUB_HTML}
    `),
    text: `Hey ${firstName || "there"},

Here is everything inside the Elevate Pain-Free Program:

- 7 chiropractic care video modules
- 90-day personal rehab protocol
- Pain Tracking Journal ($47 value)
- Posture Correction Quick Reference Guide ($37 value)
- Lifetime access and all future updates
- 90-day money-back guarantee

Total value: $297. Your investment today: $97.

Enrollment closes soon.

To your health,
Dr. Connor Oliveri
Elevate Health

Get Instant Access — $97: ${SITE_URL}/#enroll
${NURTURE_UNSUB_TEXT}`,
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
  return {
    subject: "You are in! Here is how to get started",
    html: wrap(`
      <p>Hey ${firstName || "there"}, welcome to the <strong>Elevate Pain-Free Program</strong>!</p>
      <p>Your 7-module rehabilitation program is ready. All modules are unlocked and waiting for you right now.</p>
      <table style="background:#f3f4f6;border-radius:8px;padding:16px 24px;margin:24px 0;width:100%;">
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Login URL:</strong> <a href="${SITE_URL}/login">${SITE_URL}/login</a></td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Email:</strong> ${email}</td></tr>
        <tr><td style="padding:4px 0;font-size:14px;"><strong>Temporary Password:</strong> <code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;">${tempPassword}</code></td></tr>
      </table>
      <p style="font-size:13px;color:#6b7280;"><em>Please change your password after your first login.</em></p>
      <p>Start with <strong>Module 1: Understanding Your Pain</strong> — it gives you the foundation everything else builds on.</p>
      <p>You are on your way to a pain-free life.</p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/login" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Go to My Program →
        </a>
      </p>
      <p style="font-size:13px;color:#6b7280;margin-top:24px;">To ensure you receive all course updates please add info@elevatehealthtampa.com to your contacts.</p>
    `),
    text: `Hey ${firstName || "there"}, welcome to the Elevate Pain-Free Program!

Your 7-module rehabilitation program is ready. All modules are unlocked and waiting for you right now.

Login URL: ${SITE_URL}/login
Email: ${email}
Temporary Password: ${tempPassword}

Please change your password after your first login.

Start with Module 1: Understanding Your Pain — it gives you the foundation everything else builds on.

You are on your way to a pain-free life.

To your health,
Dr. Connor Oliveri
Elevate Health

Go to My Program: ${SITE_URL}/login

To ensure you receive all course updates please add info@elevatehealthtampa.com to your contacts.`,
  };
}

export function day3Email(firstName: string) {
  return {
    subject: "Day 3 check-in — how is your pain today?",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>You are 3 days into the Elevate Pain-Free Program — nice work for showing up.</p>
      <p>Quick tip: the students who get the best results do their exercises at the same time every day. Even 20 minutes builds real momentum.</p>
      <p>If you have not finished Module 1 yet, do it today. It gives you your baseline pain score so you can track your improvement over the next 90 days.</p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/login" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Continue My Program →
        </a>
      </p>
    `),
    text: `Hey ${firstName || "there"},

You are 3 days into the Elevate Pain-Free Program — nice work for showing up.

Quick tip: the students who get the best results do their exercises at the same time every day. Even 20 minutes builds real momentum.

If you have not finished Module 1 yet, do it today. It gives you your baseline pain score so you can track your improvement over the next 90 days.

To your health,
Dr. Connor Oliveri
Elevate Health

Continue My Program: ${SITE_URL}/login`,
  };
}

export function day14Email(firstName: string) {
  return {
    subject: "Two weeks in — how to accelerate your results",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>Two weeks in — most students notice real improvement by now. How are you feeling?</p>
      <p>If you want to accelerate your results, here is an option for you.</p>
      <p><strong>1-on-1 Virtual Chiropractic Consultation — $197</strong></p>
      <p>A licensed chiropractor will review your specific muscle imbalances, assess your movement patterns, and create a custom protocol just for you.</p>
      <p>This is the fastest way to get pain-free — a session tailored exactly to your body.</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/consult" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Book My Chiropractic Consultation — $197
        </a>
      </p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
    `),
    text: `Hey ${firstName || "there"},

Two weeks in — most students notice real improvement by now. How are you feeling?

If you want to accelerate your results, here is an option for you.

1-on-1 Virtual Chiropractic Consultation — $197

A licensed chiropractor will review your specific muscle imbalances, assess your movement patterns, and create a custom protocol just for you.

This is the fastest way to get pain-free — a session tailored exactly to your body.

Book My Chiropractic Consultation — $197: ${SITE_URL}/consult

To your health,
Dr. Connor Oliveri
Elevate Health`,
  };
}

export function day30Email(firstName: string) {
  return {
    subject: "How is your pain level compared to Day 1?",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>You are 30 days in. How does your pain compare to when you started?</p>
      <p>Most students see a 50–70% reduction in pain by day 30. Some are already completely pain-free.</p>
      <p>If you want ongoing support and the ability to ask questions as you progress, I want to invite you to our <strong>Lifetime Access + Q&A Membership</strong>.</p>
      <p><strong>What you get — $97 one-time:</strong></p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Lifetime access to all future program updates</li>
        <li>Monthly live Q&A calls with our DC team</li>
        <li>Private community of pain-free members</li>
        <li>Priority email support</li>
      </ul>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/membership" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Join the Membership — $97
        </a>
      </p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
    `),
    text: `Hey ${firstName || "there"},

You are 30 days in. How does your pain compare to when you started?

Most students see a 50–70% reduction in pain by day 30. Some are already completely pain-free.

If you want ongoing support and the ability to ask questions as you progress, I want to invite you to our Lifetime Access + Q&A Membership.

What you get — $97 one-time:
- Lifetime access to all future program updates
- Monthly live Q&A calls with our DC team
- Private community of pain-free members
- Priority email support

Join the Membership — $97: ${SITE_URL}/membership

To your health,
Dr. Connor Oliveri
Elevate Health`,
  };
}

export function day90Email(firstName: string) {
  return {
    subject: "90 days — how is your pain today?",
    html: wrap(`
      <p>Hey ${firstName || "there"},</p>
      <p>90 days. This is a big milestone.</p>
      <p>How is your pain level compared to Day 1?</p>
      <p>If you are pain-free — congratulations. You did the work and it paid off. We would love to share your story.</p>
      <p>Reply to this email with your results and we will feature you in our next student spotlight.</p>
      <p><strong>Know someone with back or neck pain?</strong> Refer them and they get 20% off with your personal link.</p>
      <p>And remember — your 90-day money-back guarantee is still active. If you are not satisfied for any reason, reply to this email and we will refund you in full. No questions asked.</p>
      <p>To your health,<br>Dr. Connor Oliveri<br>Elevate Health</p>
    `),
    text: `Hey ${firstName || "there"},

90 days. This is a big milestone.

How is your pain level compared to Day 1?

If you are pain-free — congratulations. You did the work and it paid off. We would love to share your story.

Reply to this email with your results and we will feature you in our next student spotlight.

Know someone with back or neck pain? Refer them and they get 20% off with your personal link.

And remember — your 90-day money-back guarantee is still active. If you are not satisfied for any reason, reply to this email and we will refund you in full. No questions asked.

To your health,
Dr. Connor Oliveri
Elevate Health`,
  };
}
