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

// ── Post-purchase follow-up sequence ─────────────────────────────────────────

export function day3Email(firstName: string) {
  return {
    subject: "How is your pain feeling today?",
    html: wrap(`
      <p>Hi ${firstName || "there"},</p>
      <p>It has been 3 days since you joined the Elevate Pain-Free Program and I wanted to check in.</p>
      <p>By now you should have completed Module 1 and have a clear understanding of the three root causes of your chronic pain — muscle imbalances, movement pattern dysfunction, and postural collapse.</p>
      <p><strong>Here is what to focus on this week:</strong></p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Complete <strong>Module 2 — Neck Pain Relief Protocol</strong></li>
        <li>Do your exercises every morning for 20 minutes</li>
        <li>Start tracking your pain scores in your Pain Journal</li>
      </ul>
      <p>Remember — the first week is about building the habit. You will not feel dramatically different yet and that is completely normal. The results come from consistency over 90 days.</p>
      <p>Keep going. You are doing the right thing.</p>
      <p>To your health,<br>Dr. Connor Oliveri, DC<br>Elevate Health | Tampa, FL</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/login" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Go to My Program →
        </a>
      </p>
    `),
    text: `Hi ${firstName || "there"},

It has been 3 days since you joined the Elevate Pain-Free Program and I wanted to check in.

By now you should have completed Module 1 and have a clear understanding of the three root causes of your chronic pain — muscle imbalances, movement pattern dysfunction, and postural collapse.

Here is what to focus on this week:

- Complete Module 2 — Neck Pain Relief Protocol
- Do your exercises every morning for 20 minutes
- Start tracking your pain scores in your Pain Journal

Remember — the first week is about building the habit. You will not feel dramatically different yet and that is completely normal. The results come from consistency over 90 days.

Keep going. You are doing the right thing.

To your health,
Dr. Connor Oliveri, DC
Elevate Health | Tampa, FL

Go to My Program: ${SITE_URL}/login`,
  };
}

export function day14Email(firstName: string) {
  return {
    subject: "Two weeks in — how to accelerate your results",
    html: wrap(`
      <p>Hi ${firstName || "there"},</p>
      <p>Two weeks into the Elevate Pain-Free Program — congratulations on sticking with it!</p>
      <p>By now you should notice some early improvements in your flexibility and morning stiffness. If you are not feeling any changes yet do not worry — for many people the shift happens between weeks 3 and 6 as the nervous system adapts.</p>
      <p><strong>To accelerate your results:</strong></p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Make sure you are completing your exercises <strong>EVERY day</strong> — consistency is everything</li>
        <li>Check your posture throughout the day — forward head posture and slouching undo your progress</li>
        <li>Consider adding the <strong>Nutrition for Inflammation</strong> course to your program — what you eat directly affects how much inflammation you carry in your spine</li>
      </ul>
      <p><strong>Where you should be at week 2:</strong></p>
      <p style="margin:4px 0;">✓ Module 1 completed — Understanding Your Pain</p>
      <p style="margin:4px 0;">✓ Module 2 completed — Neck Pain Relief Protocol</p>
      <p style="margin:4px 0;">✓ Module 3 completed — Mid Back Pain Relief Protocol</p>
      <p style="margin:4px 0;">✓ Working on Module 4 — Lower Back Pain Relief Protocol</p>
      <p style="margin-top:16px;">If you have not purchased the Nutrition for Inflammation add-on yet you can access it from your dashboard under <strong>Upgrade My Program</strong>.</p>
      <p>Keep going — you are almost halfway through the modules!</p>
      <p>To your health,<br>Dr. Connor Oliveri, DC<br>Elevate Health | Tampa, FL</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/login" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Go to My Program →
        </a>
      </p>
    `),
    text: `Hi ${firstName || "there"},

Two weeks into the Elevate Pain-Free Program — congratulations on sticking with it!

By now you should notice some early improvements in your flexibility and morning stiffness. If you are not feeling any changes yet do not worry — for many people the shift happens between weeks 3 and 6 as the nervous system adapts.

To accelerate your results:

- Make sure you are completing your exercises EVERY day — consistency is everything
- Check your posture throughout the day — forward head posture and slouching undo your progress
- Consider adding the Nutrition for Inflammation course to your program — what you eat directly affects how much inflammation you carry in your spine

Where you should be at week 2:
✓ Module 1 completed — Understanding Your Pain
✓ Module 2 completed — Neck Pain Relief Protocol
✓ Module 3 completed — Mid Back Pain Relief Protocol
✓ Working on Module 4 — Lower Back Pain Relief Protocol

If you have not purchased the Nutrition for Inflammation add-on yet you can access it from your dashboard under Upgrade My Program.

Keep going — you are almost halfway through the modules!

To your health,
Dr. Connor Oliveri, DC
Elevate Health | Tampa, FL

Go to My Program: ${SITE_URL}/login`,
  };
}

export function day30Email(firstName: string) {
  return {
    subject: "30 days in — your pain should be changing",
    html: wrap(`
      <p>Hi ${firstName || "there"},</p>
      <p>One month into the Elevate Pain-Free Program. This is a big milestone!</p>
      <p><strong>By day 30 most of my patients report:</strong></p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Reduced morning stiffness</li>
        <li>Better range of motion in the neck and lower back</li>
        <li>Fewer pain flare-ups throughout the day</li>
        <li>Improved sleep quality</li>
        <li>More energy and less fatigue</li>
      </ul>
      <p><strong>How are you feeling compared to day 1?</strong></p>
      <p>If you have been tracking your pain scores in your Pain Journal open it now and compare your Day 1 scores to today. Most people are genuinely surprised by how much progress they have made without even realizing it.</p>
      <p><strong>Where you should be at day 30:</strong></p>
      <p style="margin:4px 0;">✓ All 7 modules completed</p>
      <p style="margin:4px 0;">✓ Daily exercise habit established</p>
      <p style="margin:4px 0;">✓ Posture awareness improved</p>
      <p style="margin:4px 0;">✓ Working through your 90-day personal protocol</p>
      <p style="margin-top:16px;">Not seeing the results you expected? Book a <strong>1-on-1 Virtual Consultation</strong> with me from your dashboard. I can review your specific pain pattern and give you personalized protocol adjustments to accelerate your results.</p>
      <p>You are one third of the way through your 90-day protocol. Keep going — the best results happen in months 2 and 3.</p>
      <p>To your health,<br>Dr. Connor Oliveri, DC<br>Elevate Health | Tampa, FL</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/login" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Go to My Program →
        </a>
      </p>
    `),
    text: `Hi ${firstName || "there"},

One month into the Elevate Pain-Free Program. This is a big milestone!

By day 30 most of my patients report:

- Reduced morning stiffness
- Better range of motion in the neck and lower back
- Fewer pain flare-ups throughout the day
- Improved sleep quality
- More energy and less fatigue

How are you feeling compared to day 1?

If you have been tracking your pain scores in your Pain Journal open it now and compare your Day 1 scores to today. Most people are genuinely surprised by how much progress they have made without even realizing it.

Where you should be at day 30:
✓ All 7 modules completed
✓ Daily exercise habit established
✓ Posture awareness improved
✓ Working through your 90-day personal protocol

Not seeing the results you expected? Book a 1-on-1 Virtual Consultation with me from your dashboard. I can review your specific pain pattern and give you personalized protocol adjustments to accelerate your results.

You are one third of the way through your 90-day protocol. Keep going — the best results happen in months 2 and 3.

To your health,
Dr. Connor Oliveri, DC
Elevate Health | Tampa, FL

Go to My Program: ${SITE_URL}/login`,
  };
}

export function day90Email(firstName: string) {
  return {
    subject: "90 days — how is your pain today?",
    html: wrap(`
      <p>Hi ${firstName || "there"},</p>
      <p>90 days ago you made a decision to take control of your chronic pain. Today I want to know — how are you feeling?</p>
      <p>If you have followed the program consistently you should be experiencing significantly less pain than when you started. Many of my patients are completely pain-free by day 90.</p>
      <p><strong>Your 90-day results checklist:</strong></p>
      <ul style="padding-left:20px;line-height:2;">
        <li>How does your pain score compare to day 1?</li>
        <li>Are you standing taller with better posture?</li>
        <li>Are you sleeping better?</li>
        <li>Are you moving with less restriction?</li>
        <li>Has your quality of life improved?</li>
      </ul>
      <p>If you are not yet pain-free do not be discouraged. Everyone heals at a different rate depending on the severity and duration of their condition. Here are your next steps:</p>
      <ul style="padding-left:20px;line-height:2;">
        <li>Book a <strong>1-on-1 Virtual Consultation</strong> from your dashboard — I will personally review your case and adjust your protocol</li>
        <li>Add the <strong>Nutrition for Inflammation</strong> course — diet plays a massive role in chronic pain</li>
        <li>Continue the protocol for another 30–60 days — some cases take longer but the results always come with consistency</li>
      </ul>
      <p><strong>Your 90-day money-back guarantee:</strong></p>
      <p>If you have completed all 7 modules and logged in for at least 30 days and you are not satisfied with your results you may request a refund from your dashboard between days 90 and 120 of your membership.</p>
      <p>Thank you for trusting me with your health. It has been an honor to be part of your pain relief journey.</p>
      <p>To your health,<br>Dr. Connor Oliveri, DC<br>Elevate Health | Tampa, FL</p>
      <p style="text-align:center;margin-top:32px;">
        <a href="${SITE_URL}/login" style="background:#0F6E56;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
          Go to My Program →
        </a>
      </p>
    `),
    text: `Hi ${firstName || "there"},

90 days ago you made a decision to take control of your chronic pain. Today I want to know — how are you feeling?

If you have followed the program consistently you should be experiencing significantly less pain than when you started. Many of my patients are completely pain-free by day 90.

Your 90-day results checklist:

- How does your pain score compare to day 1?
- Are you standing taller with better posture?
- Are you sleeping better?
- Are you moving with less restriction?
- Has your quality of life improved?

If you are not yet pain-free do not be discouraged. Everyone heals at a different rate depending on the severity and duration of their condition. Here are your next steps:

- Book a 1-on-1 Virtual Consultation from your dashboard — I will personally review your case and adjust your protocol
- Add the Nutrition for Inflammation course — diet plays a massive role in chronic pain
- Continue the protocol for another 30-60 days — some cases take longer but the results always come with consistency

Your 90-day money-back guarantee:
If you have completed all 7 modules and logged in for at least 30 days and you are not satisfied with your results you may request a refund from your dashboard between days 90 and 120 of your membership.

Thank you for trusting me with your health. It has been an honor to be part of your pain relief journey.

To your health,
Dr. Connor Oliveri, DC
Elevate Health | Tampa, FL

Go to My Program: ${SITE_URL}/login`,
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

