"use client";

export default function PostureGuidePage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { size: A4 portrait; margin: 1.5cm; }
          .page-break { page-break-before: always; }
        }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; }
      `}</style>

      {/* Print button */}
      <div className="no-print bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg">Posture Guide — Preview</span>
        <button
          onClick={() => window.print()}
          className="bg-white text-teal-700 font-bold px-6 py-2 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* Printable content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36, borderBottom: "3px solid #0F6E56", paddingBottom: 24 }}>
          <div style={{ color: "#0F6E56", fontWeight: 800, fontSize: 20, letterSpacing: 1, marginBottom: 6 }}>
            ELEVATE HEALTH
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#085041", margin: "0 0 8px" }}>
            Posture Correction Quick Reference Guide
          </h1>
          <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
            Evidence-based posture corrections for neck, mid back, and lower back pain relief
          </p>
        </div>

        {/* Grid layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          {/* Ideal Sitting Posture */}
          <Section title="Ideal Sitting Posture" color="#0F6E56">
            <BulletList items={[
              "Feet flat on the floor — hips and knees at 90°",
              "Lower back supported by chair or lumbar cushion",
              "Screen at eye level — top of monitor at brow height",
              "Shoulders relaxed, elbows at 90° on armrests",
              "Head stacked directly over shoulders — no forward head",
            ]} />
          </Section>

          {/* Ideal Standing Posture */}
          <Section title="Ideal Standing Posture" color="#0F6E56">
            <BulletList items={[
              "Feet hip-width apart, weight evenly distributed",
              "Knees soft — never locked straight",
              "Pelvis neutral — neither anteriorly nor posteriorly tilted",
              "Chest open, shoulders back and down",
              "Chin tucked — ears aligned over shoulders and hips",
            ]} />
          </Section>
        </div>

        {/* Sleep Position Guide */}
        <Section title="Sleep Position Guide" color="#085041" fullWidth>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 12 }}>
            {[
              {
                position: "Back Sleeping (Best)",
                tip: "Place a pillow under your knees to reduce lumbar pressure. Use a medium-loft pillow that supports the natural curve of your neck.",
              },
              {
                position: "Side Sleeping (Good)",
                tip: "Place a firm pillow between your knees to keep hips aligned. Keep your spine straight — avoid curling into a tight fetal position.",
              },
              {
                position: "Stomach Sleeping (Avoid)",
                tip: "Stomach sleeping forces the neck into rotation and flattens the lumbar curve. If unavoidable, place a thin pillow under your pelvis.",
              },
            ].map(({ position, tip }) => (
              <div key={position} style={{ background: "#f0fdf4", borderRadius: 8, padding: "12px 14px", border: "1px solid #bbf7d0" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#065f46", fontSize: 13 }}>{position}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{tip}</p>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ marginTop: 24 }} />

        {/* Top 5 Posture Corrections */}
        <Section title="Top 5 Posture Corrections for Desk Workers" color="#085041" fullWidth>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { num: "01", title: "Chin Tuck", desc: "Gently retract your chin backward (not down). Hold 5 seconds. Repeat 10× every hour to reverse forward head posture." },
              { num: "02", title: "Chest Opener Stretch", desc: "Clasp hands behind your back, squeeze shoulder blades together, open chest toward ceiling. Hold 15–20 seconds. Do 3× daily." },
              { num: "03", title: "Thoracic Extension over Chair", desc: "Sit at the edge of your chair. Place hands behind your head and extend your upper back over the chair back. 10 reps, 2× daily." },
              { num: "04", title: "Hip Flexor Lunge Stretch", desc: "Kneel on one knee, shift weight forward until you feel a stretch at the front of the hip. Hold 30 seconds per side. Daily." },
              { num: "05", title: "Scapular Retractions", desc: "Sit tall, squeeze shoulder blades together as if pinching a pencil between them. Hold 5 seconds. 15 reps, 3× daily." },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 32, height: 32, background: "#0F6E56", color: "#fff", fontWeight: 800, fontSize: 13, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>{num}</span>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: 700, color: "#085041", fontSize: 13 }}>{title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ marginTop: 24 }} />

        {/* Daily Posture Checklist */}
        <Section title="Daily Posture Checklist" color="#085041" fullWidth>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              "Screen at eye level",
              "Lumbar support in place",
              "Feet flat on the floor",
              "Shoulders relaxed, not raised",
              "Chin tuck performed (×10)",
              "Chest opener stretch done",
              "Hip flexor stretch done",
              "Scapular retractions done",
              "Stood up every 45–60 min",
              "Slept in back or side position",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "#f8fafc", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                <span style={{ flexShrink: 0, width: 18, height: 18, border: "2px solid #0F6E56", borderRadius: 4, display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "#374151" }}>{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 36, borderTop: "2px solid #e5e7eb", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: "#0F6E56", fontSize: 13 }}>Elevate Pain-Free Program</p>
            <p style={{ margin: 0, color: "#9ca3af", fontSize: 11 }}>elevate-health-lyart.vercel.app</p>
          </div>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: 11, textAlign: "right" }}>
            For educational purposes only.<br />Consult a healthcare provider before starting any exercise program.
          </p>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  color,
  fullWidth,
  children,
}: {
  title: string;
  color: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={fullWidth ? {} : {}}>
      <h2
        style={{
          margin: "0 0 2px",
          fontSize: 14,
          fontWeight: 800,
          color: "#fff",
          background: color,
          padding: "8px 14px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          border: `1px solid ${color}`,
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          padding: "14px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item) => (
        <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
          <span style={{ flexShrink: 0, color: "#0F6E56", fontWeight: 700, marginTop: 1 }}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
