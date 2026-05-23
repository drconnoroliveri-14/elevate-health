"use client";

export default function BackPainGuidePage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: #fff; }
          @page { size: A4 portrait; margin: 1.8cm; }
          .page-break { page-break-before: always; }
          section { page-break-inside: avoid; }
        }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafb; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Print bar */}
      <div className="no-print sticky top-0 z-10 bg-teal-700 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <span className="font-semibold text-sm">Back Pain Relief Guide — Free Download</span>
        <button
          onClick={() => window.print()}
          className="bg-white text-teal-700 font-bold px-5 py-2 rounded-lg text-sm hover:bg-teal-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px", background: "#fff" }}>

        {/* ── COVER ── */}
        <div style={{ textAlign: "center", borderBottom: "4px solid #0F6E56", paddingBottom: 40, marginBottom: 48 }}>
          <div style={{ color: "#0F6E56", fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            ELEVATE HEALTH
          </div>
          <div style={{ display: "inline-block", background: "#0F6E56", color: "#fff", borderRadius: 8, padding: "6px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>
            FREE GUIDE
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#085041", margin: "0 0 16px", lineHeight: 1.15 }}>
            The Back Pain Relief Guide
          </h1>
          <p style={{ fontSize: 18, color: "#374151", fontWeight: 500, maxWidth: 540, margin: "0 auto 24px", lineHeight: 1.5 }}>
            The 3 Root Causes of Chronic Neck &amp; Back Pain — And Why Most People Never Fix Them
          </p>
          <div style={{ width: 64, height: 4, background: "#4ECCA3", borderRadius: 4, margin: "0 auto 24px" }} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: "#0F6E56", fontSize: 15 }}>Dr. Connor Oliveri, DC</p>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>Doctor of Chiropractic · Spinal Rehabilitation Specialist</p>
            <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: 12 }}>elevatehealthtampa.com</p>
          </div>
        </div>

        {/* ── INTRO ── */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "20px 24px", marginBottom: 48 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#065f46", lineHeight: 1.7 }}>
            <strong>If you have tried rest, pain medication, stretching, or even physical therapy and your pain keeps coming back</strong> — this guide explains exactly why, and what you actually need to do instead. The information in these pages is the foundation of everything I teach in the Elevate Pain-Free Program.
          </p>
        </div>

        {/* ── ROOT CAUSE 1 ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "#0F6E56", color: "#fff", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#085041" }}>Root Cause #1: Muscle Imbalances</h2>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
            Chronic neck and back pain almost always begins with <strong>muscle imbalances</strong> — a condition where some muscles become chronically tight and overactive while their opposing muscles become weak and underactive. This creates uneven forces on the spine that compress discs, irritate nerves, and generate constant pain signals.
          </p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
            Modern life — long hours sitting, staring at screens, and repetitive movements — creates predictable patterns of imbalance that affect nearly everyone with chronic back pain.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ margin: "0 0 10px", fontWeight: 800, color: "#92400e", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Chronically Tight &amp; Overactive</p>
              {["Hip flexors (psoas, iliacus)", "Upper trapezius and levator scapulae", "Pectoralis major and minor", "Thoracolumbar fascia", "Suboccipital muscles (base of skull)", "Piriformis and deep hip rotators"].map(m => (
                <div key={m} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ flexShrink: 0, color: "#d97706", fontWeight: 700, marginTop: 1 }}>▶</span>
                  <span style={{ fontSize: 13, color: "#78350f" }}>{m}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ margin: "0 0 10px", fontWeight: 800, color: "#1e40af", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Chronically Weak &amp; Underactive</p>
              {["Deep neck flexors (longus colli)", "Gluteus maximus and medius", "Lower trapezius and serratus anterior", "Deep core stabilizers (multifidus)", "Rhomboids and mid-trapezius", "Vastus medialis (inner quad)"].map(m => (
                <div key={m} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ flexShrink: 0, color: "#3b82f6", fontWeight: 700, marginTop: 1 }}>▶</span>
                  <span style={{ fontSize: 13, color: "#1e3a8a" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#f0fdf4", borderLeft: "4px solid #0F6E56", padding: "12px 16px", borderRadius: "0 8px 8px 0", fontSize: 13, color: "#065f46", lineHeight: 1.6 }}>
            <strong>Key insight:</strong> Stretching tight muscles provides temporary relief but does not fix the imbalance. You must simultaneously strengthen the weak opposing muscles to create lasting change.
          </div>
        </section>

        {/* ── ROOT CAUSE 2 ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "#0F6E56", color: "#fff", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#085041" }}>Root Cause #2: Movement Pattern Dysfunction</h2>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
            Your nervous system learns movement habits and repeats them automatically — whether those habits are protective or harmful. When muscle imbalances develop, your brain re-routes movement through compensatory patterns that <strong>shift load onto structures not designed to bear it</strong>. Over time, this wears down discs, joints, and ligaments.
          </p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
            Research by Dr. Stuart McGill at the University of Waterloo shows that spine loading patterns — not a single traumatic event — are responsible for the majority of disc herniations and chronic back pain cases.
          </p>
          <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
            <p style={{ margin: "0 0 12px", fontWeight: 800, color: "#9f1239", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Common Harmful Movement Patterns</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                "Lumbar flexion under load (bending to pick up objects)",
                "Repeated spinal rotation while compressed",
                "Hip hinging with a rounded lower back",
                "Cervical protraction at a computer screen",
                "Overhead reaching with a depressed scapula",
                "Single-leg loading without hip stability",
                "Breath-holding during exertion (Valsalva)",
                "Sitting with a posterior pelvic tilt for hours",
              ].map(p => (
                <div key={p} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, color: "#e11d48", fontWeight: 700, marginTop: 1, fontSize: 14 }}>✕</span>
                  <span style={{ fontSize: 12, color: "#881337", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#f0fdf4", borderLeft: "4px solid #0F6E56", padding: "12px 16px", borderRadius: "0 8px 8px 0", fontSize: 13, color: "#065f46", lineHeight: 1.6 }}>
            <strong>Key insight:</strong> You can do all the right exercises and still have chronic pain if you continue moving harmfully 50–100 times a day. Fixing movement patterns is non-negotiable.
          </div>
        </section>

        {/* ── ROOT CAUSE 3 ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "#0F6E56", color: "#fff", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#085041" }}>Root Cause #3: Postural Collapse</h2>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
            Posture is not just about appearance — it directly determines how forces distribute across your spine throughout the day. <strong>Postural collapse creates cumulative loading</strong> that breaks down spinal structures over months and years, leading to the disc herniations, facet arthritis, and nerve compression that generate chronic pain.
          </p>
          <div style={{ background: "#fdf4ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
            <p style={{ margin: "0 0 10px", fontWeight: 800, color: "#6b21a8", fontSize: 14 }}>The 60-Pound Head Research</p>
            <p style={{ margin: 0, fontSize: 13, color: "#581c87", lineHeight: 1.7 }}>
              A study published in <em>Surgical Technology International</em> (Dr. Kenneth Hansraj, 2014) measured the effective weight placed on the cervical spine at different neck angles. The human head weighs approximately <strong>10–12 pounds in neutral alignment</strong>. At just 15° of forward flexion (looking at your phone), the effective load increases to <strong>27 pounds</strong>. At 30° it reaches <strong>40 pounds</strong>. At 60° — a common phone-checking position — the spine experiences the equivalent of <strong>60 pounds of force</strong>. If you check your phone 150 times per day, you are repeatedly loading your neck with 60 pounds of force thousands of times per year.
            </p>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
            The same physics apply to the lower back. Sitting in a slumped position for 8 hours per day increases lumbar disc pressure by up to 40% compared to standing — slowly compressing and desiccating the discs that serve as your spine&apos;s shock absorbers.
          </p>
          <div style={{ background: "#f0fdf4", borderLeft: "4px solid #0F6E56", padding: "12px 16px", borderRadius: "0 8px 8px 0", fontSize: 13, color: "#065f46", lineHeight: 1.6 }}>
            <strong>Key insight:</strong> Your spine accumulates damage from poor posture the same way a metal bar accumulates metal fatigue from repeated bending — one small bend barely matters, but thousands of them cause the bar to fail.
          </div>
        </section>

        {/* ── WHY STANDARD TREATMENTS FAIL ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#085041", marginBottom: 20, borderBottom: "2px solid #e5e7eb", paddingBottom: 12 }}>
            Why Standard Treatments Fail
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              {
                name: "Rest",
                why: "Passive rest weakens the stabilizing muscles that support your spine, making you more vulnerable to pain when you return to activity. Movement — done correctly — is medicine.",
              },
              {
                name: "Pain Medication",
                why: "NSAIDs and opioids mask pain signals without addressing the mechanical cause. The structural problem continues to worsen while you feel better — until the medication stops working.",
              },
              {
                name: "Generic Stretching",
                why: "Stretching tight muscles without strengthening opposing weak muscles creates short-term relief and long-term instability. It also does nothing to correct the movement patterns causing damage.",
              },
              {
                name: "Surgery",
                why: "Studies show that surgical outcomes for common back conditions (disc herniation, spinal stenosis) are no better than conservative care at 1–2 years in most cases — with significantly higher risk.",
              },
            ].map(t => (
              <div key={t.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 18px" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 800, color: "#111827", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, background: "#fee2e2", color: "#dc2626", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>✕</span>
                  {t.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.65 }}>{t.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3-STEP ACTION PLAN ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#085041", marginBottom: 8, borderBottom: "2px solid #e5e7eb", paddingBottom: 12 }}>
            Your 3-Step Immediate Action Plan
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
            Start these three exercises today to begin addressing all three root causes simultaneously. Perform them in order, once in the morning and once in the evening.
          </p>

          {[
            {
              num: "01",
              name: "Chin Tuck",
              target: "Targets: Deep neck flexors (weak) · Suboccipital muscles (tight) · Forward head posture",
              instructions: [
                "Sit or stand tall with your spine in neutral alignment",
                "Without tilting your head, gently draw your chin straight backward as if making a double chin",
                "You should feel a gentle stretch at the base of your skull and mild activation in the front of your neck",
                "Hold for 5 seconds, then relax completely",
                "Perform 10 repetitions — do this every hour at your desk",
              ],
              note: "This is the single most important exercise for desk workers. It reverses the forward head posture pattern that adds 60 pounds of load to your cervical spine.",
            },
            {
              num: "02",
              name: "Glute Bridge",
              target: "Targets: Glutes and hamstrings (weak) · Hip flexors (tight) · Lumbar stabilization",
              instructions: [
                "Lie on your back with knees bent, feet flat on the floor hip-width apart",
                "Press your low back gently into the floor to engage your core — maintain this throughout",
                "Squeeze your glutes and drive your hips toward the ceiling until your body forms a straight line from shoulders to knees",
                "Hold at the top for 3 seconds, focusing on the glute squeeze — not the low back",
                "Lower slowly over 3 seconds. Perform 3 sets of 10 repetitions daily",
              ],
              note: "Weak glutes are one of the top contributors to lower back pain. When the glutes cannot do their job, the lumbar extensors compensate — causing the chronic tension and pain most people feel.",
            },
            {
              num: "03",
              name: "Postural Reset",
              target: "Targets: All three root causes · Resets spinal alignment · Activates postural muscles",
              instructions: [
                "Stand with your back against a wall — heels 2 inches from the wall, feet hip-width apart",
                "Press the back of your head, shoulder blades, and tailbone gently against the wall",
                "Bring your chin parallel to the floor and tuck it slightly (chin tuck position)",
                "Roll your shoulders back and down, opening your chest",
                "Hold this position for 60 seconds, breathing deeply into your ribcage",
                "Step away from the wall and maintain this alignment as long as possible",
              ],
              note: "Do this every morning before you start your day and after every hour of sitting. It recalibrates your proprioceptive system — the sensory feedback that tells your brain where your spine is in space.",
            },
          ].map(step => (
            <div key={step.num} style={{ marginBottom: 24, background: "#fff", border: "1px solid #d1fae5", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: "#0F6E56", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ flexShrink: 0, width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>{step.num}</span>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: 16 }}>{step.name}</p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{step.target}</p>
                </div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <ol style={{ margin: "0 0 12px", padding: "0 0 0 20px" }}>
                  {step.instructions.map((inst, i) => (
                    <li key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, marginBottom: 6 }}>{inst}</li>
                  ))}
                </ol>
                <div style={{ background: "#f0fdf4", borderRadius: 6, padding: "10px 12px", fontSize: 12, color: "#065f46", lineHeight: 1.6 }}>
                  <strong>Why it works:</strong> {step.note}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── CTA ── */}
        <section className="no-print" style={{ background: "#0F6E56", borderRadius: 16, padding: "36px 32px", textAlign: "center", marginBottom: 40 }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>
            Ready to Go Deeper?
          </p>
          <h3 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>
            The Elevate Pain-Free Program
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>
            Just $97 · One-Time Payment · Lifetime Access
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            7 chiropractic rehabilitation modules. Step-by-step exercises you do at home in 20 minutes a day. 90-day pain-free guarantee.
          </p>
          <a
            href="https://www.elevatehealthtampa.com/#enroll"
            style={{ display: "inline-block", background: "#F5C842", color: "#085041", fontWeight: 900, fontSize: 16, padding: "16px 40px", borderRadius: 10, textDecoration: "none" }}
          >
            Get the Full Program — $97 Today →
          </a>
        </section>

        {/* ── FOOTER ── */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, color: "#0F6E56", fontSize: 13 }}>Dr. Connor Oliveri, DC</p>
            <p style={{ margin: "2px 0 0", color: "#9ca3af", fontSize: 11 }}>elevatehealthtampa.com</p>
          </div>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: 10, textAlign: "right", maxWidth: 320, lineHeight: 1.5 }}>
            For educational purposes only. This guide does not constitute medical advice. Consult a licensed healthcare provider before beginning any exercise program.
          </p>
        </div>
      </div>
    </>
  );
}
