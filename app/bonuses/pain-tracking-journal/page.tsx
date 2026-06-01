"use client";

const ROWS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function PainTrackingJournalPage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { size: A4 landscape; margin: 1.5cm; }
        }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; }
      `}</style>
      <div className="no-print bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg">Pain Tracking Journal — Preview</span>
        <button onClick={() => window.print()} className="bg-white text-teal-700 font-bold px-6 py-2 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>
          Print / Save as PDF
        </button>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 32, borderBottom: "3px solid #0F6E56", paddingBottom: 24 }}>
          <div style={{ color: "#0F6E56", fontWeight: 800, fontSize: 22, letterSpacing: 1, marginBottom: 6 }}>ELEVATE HEALTH</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#085041", margin: "0 0 8px" }}>Pain Tracking Journal</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Track your daily pain scores, exercises, and progress over 30 days</p>
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px 20px", marginBottom: 28 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#065f46", lineHeight: 1.6 }}><strong>How to use:</strong> Rate your pain from <strong>1</strong> (no pain) to <strong>10</strong> (severe pain) each morning and evening. Mark exercises as <strong>✓</strong> if completed.</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0F6E56", color: "#fff" }}>
              <th style={{ padding: "10px 8px", textAlign: "left", width: "7%" }}>Day</th>
              <th style={{ padding: "10px 8px", textAlign: "left", width: "13%" }}>Date</th>
              <th style={{ padding: "10px 12px", textAlign: "center", width: "12%" }}>Morning Pain<br /><span style={{ fontWeight: 400, fontSize: 11 }}>(1–10)</span></th>
              <th style={{ padding: "10px 12px", textAlign: "center", width: "12%" }}>Evening Pain<br /><span style={{ fontWeight: 400, fontSize: 11 }}>(1–10)</span></th>
              <th style={{ padding: "10px 12px", textAlign: "center", width: "13%" }}>Exercises<br /><span style={{ fontWeight: 400, fontSize: 11 }}>(✓ / ✗)</span></th>
              <th style={{ padding: "10px 8px", textAlign: "left" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((day) => (
              <tr key={day} style={{ background: day % 2 === 0 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "9px 8px", fontWeight: 700, color: "#0F6E56" }}>{day}</td>
                <td style={{ padding: "9px 8px", color: "#9ca3af", fontSize: 12 }}>__ /__ /__</td>
                <td style={{ padding: "9px 8px", textAlign: "center" }}><span style={{ display: "inline-block", width: 32, height: 28, border: "1px solid #d1d5db", borderRadius: 4, background: "#fff" }} /></td>
                <td style={{ padding: "9px 8px", textAlign: "center" }}><span style={{ display: "inline-block", width: 32, height: 28, border: "1px solid #d1d5db", borderRadius: 4, background: "#fff" }} /></td>
                <td style={{ padding: "9px 8px", textAlign: "center" }}><span style={{ display: "inline-block", width: 32, height: 28, border: "1px solid #d1d5db", borderRadius: 4, background: "#fff" }} /></td>
                <td style={{ padding: "9px 8px" }}><span style={{ display: "block", height: 28, borderBottom: "1px solid #e5e7eb" }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}