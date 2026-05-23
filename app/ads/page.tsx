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
      {/* Logo — top right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.PNG"
        alt="Elevate Health"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          height: "84px",
          width: "auto",
          filter: "brightness(0) invert(1)",
          zIndex: 10,
        }}
      />

      {/* Subtle background pattern */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 80% 20%, rgba(78,204,163,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.25) 0%, transparent 50%)",
      }} />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 90px 40px", position: "relative" }}>
        <h1 style={{ color: "white", fontSize: 88, fontWeight: 900, lineHeight: 1.05, marginBottom: 28, letterSpacing: "-2px" }}>
          Why does your back pain keep coming back?
        </h1>

        <p style={{ color: "white", fontSize: 36, fontWeight: 700, lineHeight: 1.35, marginBottom: 16 }}>
          (And how to fix it{" "}
          <span style={{ color: GOLD, fontWeight: 900 }}>FROM HOME</span>
          {" "}in 20 minutes a day)
        </p>

        <p style={{ color: "rgba(78,204,163,0.9)", fontSize: 28, fontWeight: 500, lineHeight: 1.4 }}>
          It&apos;s not your age. It&apos;s not your genetics.<br />Here&apos;s the real reason.
        </p>

        {/* Decorative line */}
        <div style={{ width: 80, height: 4, background: GOLD, borderRadius: 2, marginTop: 50 }} />
      </div>

      {/* Bottom white section */}
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
      {/* Logo — top right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.PNG"
        alt="Elevate Health"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          height: "84px",
          width: "auto",
          filter: "brightness(0) invert(1)",
          zIndex: 10,
        }}
      />

      {/* Background gradients simulating body/spine imagery */}
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse at 50% 0%, rgba(15,110,86,0.5) 0%, transparent 55%)",
          "radial-gradient(ellipse at 100% 100%, rgba(15,110,86,0.3) 0%, transparent 50%)",
          "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
        ].join(", "),
      }} />

      {/* Spine decoration */}
      <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", opacity: 0.06 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ width: 60, height: 18, background: "white", borderRadius: 4, marginBottom: 8, marginLeft: i % 2 === 0 ? 0 : 8 }} />
        ))}
      </div>

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
      {/* Logo — top right (no filter: white bg ad) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.PNG"
        alt="Elevate Health"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          height: "84px",
          width: "auto",
          zIndex: 10,
        }}
      />

      {/* Top teal bar */}
      <div style={{ height: 10, background: `linear-gradient(90deg, ${TEAL}, ${TEAL_LIGHT})` }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "52px 90px 48px" }}>
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
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
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
      <div style={{ height: 10, background: `linear-gradient(90deg, ${TEAL_LIGHT}, ${TEAL})` }} />
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
