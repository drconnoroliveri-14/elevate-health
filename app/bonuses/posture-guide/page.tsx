"use client";

export default function PostureGuidePage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { size: A4 portrait; margin: 1.5cm; }
        }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; }
      `}</style>
      <div className="no-print bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg">Posture Guide — Preview</span>
        <button onClick={() => window.print()} className="bg-white text-teal-700 font-bold px-6 py-2 rounded-lg hover:bg-teal-50 transition-colors">Print / Save as PDF</button>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 36, borderBottom: "3px solid #0F6E56", paddingBottom: 24 }}>
          <div style={{ color: "#0F6E56", fontWeight: 800, fontSize: 20, letterSpacing: 1, marginBottom: 6 }}>ELEVATE HEALTH</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#085041", margin: "0 0 8px" }}>Posture Correction Quick Reference Guide</h1>
          <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Evidence-based posture corrections for neck, mid back, and lower back pain relief</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <Section title="Ideal Sitting Posture" color="#0F6E56"><BulletList items={["Feet flat on the floor — hips and knees at 90°","Lower back supported by chair or lumbar cushion","Screen at eye level — top of monitor at brow height","Shoulders relaxed, elbows at 90° on armrests","Head stacked directly over shoulders — no forward head"]} /></Section>
          <Section title="Ideal Standing Posture" color="#0F6E56"><BulletList items={["Feet hip-width apart, weight evenly distributed","Knees soft — never locked straight","Pelvis neutral — neither anteriorly nor posteriorly tilted","Chest open, shoulders back and down","Chin tucked — ears aligned over shoulders and hips"]} /></Section>
        </div>
        <Section title="Daily Posture Checklist" color="#085041" fullWidth>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["Screen at eye level","Lumbar support in place","Feet flat on the floor","Shoulders relaxed, not raised","Chin tuck performed (×10)","Chest opener stretch done","Hip flexor stretch done","Scapular retractions done","Stood up every 45–60 min","Slept in back or side position"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "#f8fafc", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                <span style={{ flexShrink: 0, width: 18, height: 18, border: "2px solid #0F6E56", borderRadius: 4, display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "#374151" }}>{item}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

function Section({ title, color, fullWidth, children }: { title: string; color: string; fullWidth?: boolean; children: React.ReactNode }) {
  return (
    <div style={fullWidth ? {} : {}}>
      <h2 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 800, color: "#fff", background: color, padding: "8px 14px", borderRadius: "8px 8px 0 0" }}>{title}</h2>
      <div style={{ border: `1px solid ${color}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "14px" }}>{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item) => (
        <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
          <span style={{ flexShrink: 0, color: "#0F6E56", fontWeight: 700, marginTop: 1 }}>✓</span>{item}
        </li>
      ))}
    </ul>
  );
}