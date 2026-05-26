"use client";

export const dynamic = "force-static";

const TEAL = "#0F6E56";
const TEAL_LIGHT = "#4ECCA3";
const GOLD = "#F5C842";

function DownloadButton({ adId }: { adId: string }) {
  function handlePrint() {
    const el = document.getElementById(adId);
    if (!el) return;
    const win = window.open("", "_blank", "width=1200,height=1200");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 1080px; height: 1080px; overflow: hidden; font-family: Inter, sans-serif; }
            @media print {
              @page { size: 1080px 1080px; margin: 0; }
              body { width: 1080px; height: 1080px; }
            }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  }

  return (
    <button
      onClick={handlePrint}
      className="mt-4 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Download / Print Ad
    </button>
  );
}

/* ── Ad 1 — Curiosity Hook ─────────────────────────────────────────── */
function Ad1() {
  return (
    <div
      id="ad-1"
      style={{
        width: 1080,
        height: 1080,
        background: TEAL,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Main area: left text panel + right image panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", position: "relative" }}>
        {/* Left 65% — teal background with text */}
        <div style={{
          width: "65%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 60px 40px 90px",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Subtle radial glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.25) 0%, transparent 60%)",
          }} />

          <h1 style={{ color: "white", fontSize: 80, fontWeight: 900, lineHeight: 1.05, marginBottom: 28, letterSpacing: "-2px", position: "relative" }}>
            Why does your back pain keep coming back?
          </h1>

          <p style={{ color: "white", fontSize: 32, fontWeight: 700, lineHeight: 1.35, marginBottom: 16, position: "relative" }}>
            (And how to fix it{" "}
            <span style={{ color: GOLD, fontWeight: 900 }}>FROM HOME</span>
            {" "}in 20 minutes a day)
          </p>

          <p style={{ color: "rgba(78,204,163,0.9)", fontSize: 26, fontWeight: 500, lineHeight: 1.4, position: "relative" }}>
            It&apos;s not your age. It&apos;s not your genetics.<br />Here&apos;s the real reason.
          </p>

          <div style={{ width: 80, height: 4, background: GOLD, borderRadius: 2, marginTop: 50, position: "relative" }} />
        </div>

        {/* Right 35% — spine image with teal-to-transparent gradient overlay */}
        <div style={{ width: "35%", position: "relative", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
          {/* Gradient: teal on left fading to transparent on right */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(90deg, ${TEAL} 0%, rgba(15,110,86,0.6) 40%, transparent 100%)`,
          }} />
        </div>
      </div>

      {/* Bottom white section — full width */}
      <div style={{
        background: "white",
        padding: "36px 90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}>
        <div>
          <p style={{ color: "#4b5563", fontSize: 19 }}>7-Module At-Home Rehab Program</p>
          <p style={{ color: "#6b7280", fontSize: 16, marginTop: 4 }}>$97 &nbsp;·&nbsp; 90-Day Money-Back Guarantee</p>
        </div>
        <div style={{
          background: GOLD,
          color: "#1a1a1a",
          fontWeight: 800,
          fontSize: 22,
          padding: "20px 44px",
          borderRadius: 14,
          whiteSpace: "nowrap",
          letterSpacing: "-0.3px",
        }}>
          Learn More →
        </div>
      </div>
    </div>
  );
}

/* ── Ad 2 — Social Proof ───────────────────────────────────────────── */
function Ad2() {
  return (
    <div
      id="ad-2"
      style={{
        width: 1080,
        height: 1080,
        background: "#0a1a14",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Spine image background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
      />
      {/* Dark overlay at 75% opacity for text readability */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "70px 90px 40px", position: "relative" }}>
        {/* Star badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(245,200,66,0.15)", border: "1.5px solid rgba(245,200,66,0.4)",
          borderRadius: 50, padding: "10px 24px", marginBottom: 50, alignSelf: "flex-start",
        }}>
          <span style={{ color: GOLD, fontSize: 22 }}>★★★★★</span>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, fontWeight: 600 }}>2,000+ Pain-Free Customers</span>
        </div>

        <h1 style={{ color: "white", fontSize: 82, fontWeight: 900, lineHeight: 1.08, marginBottom: 32, letterSpacing: "-2px" }}>
          &ldquo;I eliminated 6 years of back pain in 8 weeks&rdquo;
        </h1>

        <p style={{ color: TEAL_LIGHT, fontSize: 28, fontWeight: 600, marginBottom: 32 }}>
          — Michael R., age 52
        </p>

        {/* At-home badge */}
        <div style={{
          background: TEAL,
          borderRadius: 10,
          padding: "14px 24px",
          marginBottom: 32,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          alignSelf: "flex-start",
        }}>
          <span style={{ color: GOLD, fontSize: 22, fontWeight: 900 }}>✓ Done Completely From Home</span>
        </div>

        {/* Teal divider */}
        <div style={{ width: "100%", height: 2, background: `linear-gradient(90deg, ${TEAL_LIGHT}, transparent)`, marginBottom: 32 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 18 }}>The Elevate Pain-Free Program</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 4 }}>$97 Today · 90-Day Money Back Guarantee</p>
          </div>
          <div style={{
            background: GOLD,
            color: "#1a1a1a",
            fontWeight: 800,
            fontSize: 21,
            padding: "20px 40px",
            borderRadius: 14,
            whiteSpace: "nowrap",
          }}>
            Get Instant Access →
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Ad 3 — Direct Offer ───────────────────────────────────────────── */
function Ad3() {
  const bullets = [
    "100% At-Home — No gym or equipment needed",
    "Developed with licensed chiropractors",
    "Just 20 minutes a day from your living room",
    "90-day money-back guarantee",
  ];

  return (
    <div
      id="ad-3"
      style={{
        width: 1080,
        height: 1080,
        background: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Spine image watermark at 15% opacity */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.15 }}
      />

      {/* Top teal bar */}
      <div style={{ height: 10, background: `linear-gradient(90deg, ${TEAL}, ${TEAL_LIGHT})`, position: "relative" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "52px 90px 48px", position: "relative" }}>
        {/* Headline */}
        <h1 style={{ color: TEAL, fontSize: 74, fontWeight: 900, lineHeight: 1.08, marginBottom: 40, letterSpacing: "-2px" }}>
          The At-Home Fix for Chronic Neck &amp; Back Pain
        </h1>

        {/* Bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 52 }}>
          {bullets.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span style={{ color: "#1f2937", fontSize: 26, fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{
          background: "#f9fafb",
          border: `2px solid ${TEAL}`,
          borderRadius: 20,
          padding: "36px 44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          width: "100%",
        }}>
          <div>
            <p style={{ color: "#ef4444", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
              ⚡ Limited Time Offer
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span style={{ color: "#9ca3af", fontSize: 32, textDecoration: "line-through", fontWeight: 500 }}>$297</span>
              <span style={{ color: TEAL, fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: "-2px" }}>$97</span>
            </div>
            <p style={{ color: "#6b7280", fontSize: 16, marginTop: 4 }}>One-time payment · Lifetime access</p>
          </div>
          <div style={{
            background: GOLD,
            color: "#1a1a1a",
            fontWeight: 800,
            fontSize: 24,
            padding: "24px 48px",
            borderRadius: 16,
            whiteSpace: "nowrap",
            boxShadow: `0 4px 20px rgba(245,200,66,0.4)`,
          }}>
            Start Pain-Free Today →
          </div>
        </div>
      </div>

      {/* Bottom teal bar */}
      <div style={{ height: 10, background: `linear-gradient(90deg, ${TEAL_LIGHT}, ${TEAL})`, position: "relative" }} />
    </div>
  );
}

export default function AdsPage() {
  const ads = [
    { id: "ad-1", label: "Ad 1 — Curiosity Hook", component: <Ad1 /> },
    { id: "ad-2", label: "Ad 2 — Social Proof", component: <Ad2 /> },
    { id: "ad-3", label: "Ad 3 — Direct Offer", component: <Ad3 /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Meta / Instagram Ad Creatives</h1>
          <p className="text-gray-500 text-sm">1080×1080px · Click &ldquo;Download&rdquo; under each ad to print/save as image</p>
        </div>

        <div className="space-y-16">
          {ads.map(({ id, label, component }) => (
            <div key={id}>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">{label}</p>
              {/* Scale down for preview — actual div is 1080×1080 */}
              <div style={{ width: 540, height: 540, overflow: "hidden", borderRadius: 12, boxShadow: "0 4px 32px rgba(0,0,0,0.15)" }}>
                <div style={{ transform: "scale(0.5)", transformOrigin: "top left", width: 1080, height: 1080 }}>
                  {component}
                </div>
              </div>
              <DownloadButton adId={id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
