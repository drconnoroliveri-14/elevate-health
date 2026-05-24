"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PosturePhoto {
  id: string;
  photo_url: string;
  signed_url: string | null;
  photo_date: string;
  day_number: number | null;
  view_type: "front" | "side" | "back";
  notes: string | null;
}

const VIEWS: Array<{ key: "front" | "side" | "back"; label: string }> = [
  { key: "front", label: "Front View" },
  { key: "side", label: "Side View" },
  { key: "back", label: "Back View" },
];

const MILESTONES = [1, 30, 60, 90];

const VIEW_TIPS: Record<string, string> = {
  front: "Front view: Use the horizontal lines to check shoulder and hip levelness — both sides should be at the same height.",
  side: "Side view: Align the plumb line with your ear, shoulder, hip, and ankle — they should form a straight vertical line for ideal posture.",
  back: "Back view: Check for shoulder and hip symmetry using the horizontal lines. The plumb line reveals any lateral spine curvature.",
};

const SILHOUETTE_INSTRUCTIONS: Record<string, string> = {
  front: "Face the camera with your feet shoulder-width apart and arms at your sides.",
  side: "Stand sideways to the camera. Keep your arms relaxed at your sides.",
  back: "Turn your back to the camera. Keep your feet shoulder-width apart.",
};

function todayStr() { return new Date().toISOString().split("T")[0]; }

function calcDayNumber(purchasedAt: string) {
  return Math.max(1, Math.floor((Date.now() - new Date(purchasedAt).getTime()) / 86_400_000) + 1);
}

function milestoneDateStr(purchasedAt: string, targetDay: number) {
  const d = new Date(purchasedAt);
  d.setDate(d.getDate() + targetDay - 1);
  return d.toISOString().split("T")[0];
}

function formatDateDisplay(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function daysUntilDate(dateStr: string) {
  return Math.ceil((new Date(dateStr + "T12:00:00").getTime() - Date.now()) / 86_400_000);
}

function getPhotosNearMilestone(photos: PosturePhoto[], purchasedAt: string, milestone: number) {
  const target = new Date(milestoneDateStr(purchasedAt, milestone) + "T12:00:00").getTime();
  return photos.filter(p => Math.abs(new Date(p.photo_date + "T12:00:00").getTime() - target) <= 7 * 86_400_000);
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  );
}

// SVG posture silhouette for the pre-upload modal
function PostureSilhouette({ view }: { view: "front" | "side" | "back" }) {
  return (
    <svg viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Plumb line */}
      <line x1="60" y1="0" x2="60" y2="240" stroke="#99f6e4" strokeWidth="1" strokeDasharray="6 4" />

      {view === "front" && (
        <>
          {/* Head */}
          <circle cx="60" cy="22" r="14" stroke="#0d9488" strokeWidth="2.5" />
          {/* Neck */}
          <line x1="60" y1="36" x2="60" y2="50" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Shoulders */}
          <line x1="28" y1="58" x2="92" y2="58" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Shoulder level label */}
          <text x="4" y="56" fill="#0d9488" fontSize="7" fontFamily="sans-serif">─ shoulders</text>
          {/* Torso */}
          <line x1="60" y1="50" x2="60" y2="118" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left arm */}
          <line x1="28" y1="58" x2="20" y2="100" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right arm */}
          <line x1="92" y1="58" x2="100" y2="100" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hips */}
          <line x1="40" y1="118" x2="80" y2="118" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hip level label */}
          <text x="4" y="116" fill="#0d9488" fontSize="7" fontFamily="sans-serif">─ hips</text>
          {/* Left leg upper */}
          <line x1="48" y1="118" x2="44" y2="170" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right leg upper */}
          <line x1="72" y1="118" x2="76" y2="170" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left leg lower */}
          <line x1="44" y1="170" x2="42" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right leg lower */}
          <line x1="76" y1="170" x2="78" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Feet */}
          <line x1="36" y1="218" x2="50" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="218" x2="84" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {view === "side" && (
        <>
          {/* Head */}
          <circle cx="60" cy="22" r="14" stroke="#0d9488" strokeWidth="2.5" />
          {/* Neck — slightly forward of plumb */}
          <line x1="60" y1="36" x2="60" y2="50" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Spine (ideal = aligned with plumb) */}
          <line x1="60" y1="50" x2="60" y2="118" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Shoulder dot */}
          <circle cx="60" cy="58" r="4" fill="#0d9488" />
          {/* Shoulder label */}
          <text x="66" y="60" fill="#0d9488" fontSize="7" fontFamily="sans-serif">shoulder</text>
          {/* Hip dot */}
          <circle cx="60" cy="118" r="4" fill="#0d9488" />
          {/* Hip label */}
          <text x="66" y="120" fill="#0d9488" fontSize="7" fontFamily="sans-serif">hip</text>
          {/* One arm (front) */}
          <line x1="60" y1="58" x2="52" y2="100" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leg upper */}
          <line x1="60" y1="118" x2="60" y2="170" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Knee dot */}
          <circle cx="60" cy="170" r="3" fill="#0d9488" />
          {/* Knee label */}
          <text x="66" y="172" fill="#0d9488" fontSize="7" fontFamily="sans-serif">knee</text>
          {/* Leg lower */}
          <line x1="60" y1="170" x2="60" y2="215" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Ankle dot */}
          <circle cx="60" cy="215" r="3" fill="#0d9488" />
          {/* Ankle label */}
          <text x="66" y="217" fill="#0d9488" fontSize="7" fontFamily="sans-serif">ankle</text>
          {/* Foot */}
          <line x1="60" y1="215" x2="76" y2="220" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {view === "back" && (
        <>
          {/* Head */}
          <circle cx="60" cy="22" r="14" stroke="#0d9488" strokeWidth="2.5" />
          {/* Neck */}
          <line x1="60" y1="36" x2="60" y2="50" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Shoulders */}
          <line x1="28" y1="58" x2="92" y2="58" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          <text x="4" y="56" fill="#0d9488" fontSize="7" fontFamily="sans-serif">─ shoulders</text>
          {/* Spine */}
          <line x1="60" y1="50" x2="60" y2="118" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left arm */}
          <line x1="28" y1="58" x2="20" y2="100" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right arm */}
          <line x1="92" y1="58" x2="100" y2="100" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hips */}
          <line x1="40" y1="118" x2="80" y2="118" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          <text x="4" y="116" fill="#0d9488" fontSize="7" fontFamily="sans-serif">─ hips</text>
          {/* Left leg upper */}
          <line x1="48" y1="118" x2="44" y2="170" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right leg upper */}
          <line x1="72" y1="118" x2="76" y2="170" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left leg lower */}
          <line x1="44" y1="170" x2="42" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right leg lower */}
          <line x1="76" y1="170" x2="78" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Feet */}
          <line x1="36" y1="218" x2="50" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="218" x2="84" y2="218" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function PostureTrackerPage() {
  const [photos, setPhotos] = useState<PosturePhoto[]>([]);
  const [purchasedAt, setPurchasedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploadDate, setUploadDate] = useState(todayStr());
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>({ front: null, side: null, back: null });
  const [pendingPreviews, setPendingPreviews] = useState<Record<string, string | null>>({ front: null, side: null, back: null });
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  // Pre-upload silhouette modal state
  const [uploadModalView, setUploadModalView] = useState<"front" | "side" | "back" | null>(null);

  // Hidden file inputs — one for gallery, one for camera per view
  const frontRef = useRef<HTMLInputElement>(null);
  const sideRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const fileRefs = { front: frontRef, side: sideRef, back: backRef };

  const frontCameraRef = useRef<HTMLInputElement>(null);
  const sideCameraRef = useRef<HTMLInputElement>(null);
  const backCameraRef = useRef<HTMLInputElement>(null);
  const cameraRefs = { front: frontCameraRef, side: sideCameraRef, back: backCameraRef };

  // Analysis state
  const [analysisPhoto, setAnalysisPhoto] = useState<PosturePhoto | null>(null);
  const [showPlumb, setShowPlumb] = useState(false);
  const [showHoriz, setShowHoriz] = useState(false);
  const [showHoriz2, setShowHoriz2] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(40);
  const [plumbX, setPlumbX] = useState(200);
  const [horizY, setHorizY] = useState(160);
  const [horizY2, setHorizY2] = useState(320);
  const [dragging, setDragging] = useState<"plumb" | "horiz1" | "horiz2" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);

  // Comparison state
  const [compareMs, setCompareMs] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [photosRes, profileRes] = await Promise.all([
          fetch("/api/posture-photos"),
          fetch("/api/profile"),
        ]);
        if (photosRes.ok) setPhotos(await photosRes.json());
        if (profileRes.ok) {
          const p = await profileRes.json();
          if (p.purchased_at) setPurchasedAt(p.purchased_at);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Draw canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = loadedImgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image centered/fitted
    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const ix = (canvas.width - img.naturalWidth * scale) / 2;
    const iy = (canvas.height - img.naturalHeight * scale) / 2;
    ctx.drawImage(img, ix, iy, img.naturalWidth * scale, img.naturalHeight * scale);

    // Plumb line (red dashed vertical)
    if (showPlumb) {
      ctx.save();
      ctx.strokeStyle = "rgba(220,38,38,0.9)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(plumbX, 0);
      ctx.lineTo(plumbX, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      // Label background
      const labelW = 74;
      const labelH = 16;
      const labelX = Math.min(plumbX + 6, canvas.width - labelW - 4);
      ctx.fillStyle = "rgba(220,38,38,0.15)";
      ctx.fillRect(labelX, 6, labelW, labelH);
      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = "rgba(220,38,38,1)";
      ctx.fillText("◄ Plumb Line ►", labelX + 4, 18);
      ctx.restore();
    }

    // Shoulder horizontal line (blue dashed)
    if (showHoriz) {
      ctx.save();
      ctx.strokeStyle = "rgba(37,99,235,0.9)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, horizY);
      ctx.lineTo(canvas.width, horizY);
      ctx.stroke();
      ctx.setLineDash([]);
      const labelW = 96;
      const labelH = 16;
      const labelY = Math.max(horizY - 18, 4);
      ctx.fillStyle = "rgba(37,99,235,0.15)";
      ctx.fillRect(4, labelY, labelW, labelH);
      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = "rgba(37,99,235,1)";
      ctx.fillText("▲ Shoulder Level ▼", 8, labelY + 12);
      ctx.restore();
    }

    // Hip horizontal line (purple dashed)
    if (showHoriz2) {
      ctx.save();
      ctx.strokeStyle = "rgba(124,58,237,0.9)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, horizY2);
      ctx.lineTo(canvas.width, horizY2);
      ctx.stroke();
      ctx.setLineDash([]);
      const labelW = 80;
      const labelH = 16;
      const labelY = Math.max(horizY2 - 18, 4);
      ctx.fillStyle = "rgba(124,58,237,0.15)";
      ctx.fillRect(4, labelY, labelW, labelH);
      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = "rgba(124,58,237,1)";
      ctx.fillText("▲ Hip Level ▼", 8, labelY + 12);
      ctx.restore();
    }

    // Ideal posture overlay (green figure)
    if (showOverlay) {
      ctx.save();
      ctx.globalAlpha = overlayOpacity / 100;
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const cx = canvas.width / 2;
      const h = canvas.height;
      const w = canvas.width;
      const headR = h * 0.07;
      const headCy = h * 0.1;
      const shoulderY = headCy + headR * 1.6;
      const sw = w * 0.22;
      const hipY = shoulderY + h * 0.28;
      const hw = w * 0.14;
      const kneeY = hipY + h * 0.22;
      const ankleY = kneeY + h * 0.19;

      ctx.beginPath(); ctx.arc(cx, headCy, headR, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, headCy + headR); ctx.lineTo(cx, hipY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sw, shoulderY); ctx.lineTo(cx + sw, shoulderY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sw, shoulderY); ctx.lineTo(cx - sw * 0.85, (shoulderY + hipY) / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + sw, shoulderY); ctx.lineTo(cx + sw * 0.85, (shoulderY + hipY) / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - hw, hipY); ctx.lineTo(cx + hw, hipY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - hw * 0.6, hipY); ctx.lineTo(cx - hw * 0.4, kneeY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + hw * 0.6, hipY); ctx.lineTo(cx + hw * 0.4, kneeY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - hw * 0.4, kneeY); ctx.lineTo(cx - hw * 0.35, ankleY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + hw * 0.4, kneeY); ctx.lineTo(cx + hw * 0.35, ankleY); ctx.stroke();

      ctx.restore();
    }
  }, [showPlumb, showHoriz, showHoriz2, showOverlay, overlayOpacity, plumbX, horizY, horizY2]);

  // Load photo into canvas when analysisPhoto changes
  useEffect(() => {
    if (!analysisPhoto?.signed_url) { loadedImgRef.current = null; return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { loadedImgRef.current = img; redraw(); };
    img.src = analysisPhoto.signed_url;
  }, [analysisPhoto, redraw]);

  // Redraw when tool state changes
  useEffect(() => {
    if (loadedImgRef.current) redraw();
  }, [redraw]);

  // Canvas coordinate helpers
  function canvasPos(clientX: number, clientY: number) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const { x, y } = canvasPos(e.clientX, e.clientY);
    if (showPlumb && Math.abs(x - plumbX) < 14) setDragging("plumb");
    else if (showHoriz && Math.abs(y - horizY) < 14) setDragging("horiz1");
    else if (showHoriz2 && Math.abs(y - horizY2) < 14) setDragging("horiz2");
  }
  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging) return;
    const { x, y } = canvasPos(e.clientX, e.clientY);
    if (dragging === "plumb") setPlumbX(Math.max(0, x));
    if (dragging === "horiz1") setHorizY(Math.max(0, y));
    if (dragging === "horiz2") setHorizY2(Math.max(0, y));
  }
  function onMouseUp() { setDragging(null); }

  function onTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
    const t = e.touches[0];
    const { x, y } = canvasPos(t.clientX, t.clientY);
    if (showPlumb && Math.abs(x - plumbX) < 22) { e.preventDefault(); setDragging("plumb"); }
    else if (showHoriz && Math.abs(y - horizY) < 22) { e.preventDefault(); setDragging("horiz1"); }
    else if (showHoriz2 && Math.abs(y - horizY2) < 22) { e.preventDefault(); setDragging("horiz2"); }
  }
  function onTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    if (!dragging) return;
    e.preventDefault();
    const t = e.touches[0];
    const { x, y } = canvasPos(t.clientX, t.clientY);
    if (dragging === "plumb") setPlumbX(Math.max(0, x));
    if (dragging === "horiz1") setHorizY(Math.max(0, y));
    if (dragging === "horiz2") setHorizY2(Math.max(0, y));
  }
  function onTouchEnd() { setDragging(null); }

  // File select
  function handleFileSelect(view: "front" | "side" | "back", file: File) {
    const reader = new FileReader();
    reader.onload = e2 => setPendingPreviews(prev => ({ ...prev, [view]: e2.target?.result as string }));
    reader.readAsDataURL(file);
    setPendingFiles(prev => ({ ...prev, [view]: file }));
    setUploadModalView(null);
  }

  function clearPending(view: string) {
    setPendingFiles(prev => ({ ...prev, [view]: null }));
    setPendingPreviews(prev => ({ ...prev, [view]: null }));
  }

  // Compress image to max 1200px, JPEG 0.8 quality using Canvas API
  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      console.log("[compress] start:", file.name, file.size, file.type);
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX = 1200;
        let width = img.naturalWidth || img.width || 800;
        let height = img.naturalHeight || img.height || 1067;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        console.log("[compress] canvas size:", width, "x", height);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas not available on this device")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (blob) {
            console.log("[compress] output size:", blob.size, "bytes");
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob returned null"));
          }
        }, "image/jpeg", 0.8);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(objectUrl);
        console.error("[compress] image load error:", e);
        reject(new Error(`Could not load image: ${file.name} (${file.type})`));
      };
      img.src = objectUrl;
    });
  }

  // Upload handler
  async function handleUpload() {
    const hasAny = VIEWS.some(v => pendingFiles[v.key]);
    if (!hasAny) { setUploadMsg("Please select at least one photo to upload."); return; }
    setUploading(true);
    setUploadMsg("");

    // Remember first view for auto-analysis after upload
    const firstView = VIEWS.find(v => pendingFiles[v.key])?.key ?? null;

    try {
      const currentDay = purchasedAt
        ? Math.max(1, Math.floor((new Date(uploadDate + "T12:00:00").getTime() - new Date(purchasedAt).getTime()) / 86_400_000) + 1)
        : null;

      // Compress each file individually
      const compressed: Array<{ view: string; blob: Blob }> = [];
      for (const v of VIEWS) {
        const file = pendingFiles[v.key];
        if (!file) continue;
        try {
          const blob = await compressImage(file);
          compressed.push({ view: v.key, blob });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Compression failed";
          console.error(`[upload] compress error for ${v.key}:`, err);
          throw new Error(`Could not process ${v.label}: ${msg}`);
        }
      }

      // Upload sequentially so errors are easier to diagnose
      for (const { view, blob } of compressed) {
        console.log(`[upload] uploading ${view}: ${blob.size} bytes`);
        const fd = new FormData();
        fd.append("photo", blob, `${view}.jpg`);
        fd.append("view_type", view);
        fd.append("photo_date", uploadDate);
        if (currentDay) fd.append("day_number", String(currentDay));
        if (notes.trim()) fd.append("notes", notes.trim());

        const res = await fetch("/api/posture-photos/upload", { method: "POST", body: fd });
        if (!res.ok) {
          let apiError = `Server error (${res.status})`;
          try {
            const body = await res.json();
            apiError = body.error ?? apiError;
          } catch { /* response was not JSON */ }
          console.error(`[upload] ${view} failed:`, res.status, apiError);
          throw new Error(`Upload failed for ${view} view: ${apiError}`);
        }
        console.log(`[upload] ${view} uploaded ok`);
      }

      setUploadMsg("Photos saved!");
      setPendingFiles({ front: null, side: null, back: null });
      setPendingPreviews({ front: null, side: null, back: null });
      setNotes("");

      // Refresh photo list
      const res = await fetch("/api/posture-photos");
      if (res.ok) {
        const allPhotos: PosturePhoto[] = await res.json();
        setPhotos(allPhotos);

        // Auto-open analysis on the first uploaded photo
        if (firstView) {
          const uploaded = allPhotos.find(p => p.view_type === firstView && p.photo_date === uploadDate);
          if (uploaded) {
            setAnalysisPhoto(uploaded);
            setShowPlumb(true);
            setShowHoriz(true);
            setShowHoriz2(true);
            setShowOverlay(false);
            setPlumbX(200);
            setHorizY(Math.round(533 * 0.28));
            setHorizY2(Math.round(533 * 0.58));
            setTimeout(() => {
              document.getElementById("analysis-section")?.scrollIntoView({ behavior: "smooth" });
            }, 400);
          }
        }
      }
    } catch (err) {
      setUploadMsg(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMsg(m => m === "Photos saved!" ? "" : m), 5000);
    }
  }

  // Open analysis with pre-set lines from timeline
  function openAnalysis(photo: PosturePhoto) {
    setAnalysisPhoto(photo);
    setShowPlumb(true);
    setShowHoriz(true);
    setShowHoriz2(true);
    setShowOverlay(false);
    setPlumbX(200);
    setHorizY(Math.round(533 * 0.28));
    setHorizY2(Math.round(533 * 0.58));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete handler
  async function handleDelete(id: string) {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    await fetch(`/api/posture-photos/${id}`, { method: "DELETE" });
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (analysisPhoto?.id === id) setAnalysisPhoto(null);
  }

  // Download annotated canvas
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `posture-analysis-${analysisPhoto?.photo_date ?? todayStr()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // Computed values
  const currentDay = purchasedAt ? calcDayNumber(purchasedAt) : null;
  const progressPct = currentDay ? Math.min(100, Math.round((currentDay / 90) * 100)) : 0;
  const streak = purchasedAt
    ? MILESTONES.filter(ms => getPhotosNearMilestone(photos, purchasedAt, ms).length > 0).length
    : 0;

  const nextMilestone = purchasedAt
    ? MILESTONES.find(ms => daysUntilDate(milestoneDateStr(purchasedAt, ms)) >= 0)
    : null;
  const daysUntilNext = purchasedAt && nextMilestone
    ? Math.max(0, daysUntilDate(milestoneDateStr(purchasedAt, nextMilestone)))
    : null;

  const day1Photos = purchasedAt ? getPhotosNearMilestone(photos, purchasedAt, 1) : [];
  const comparePhotos = purchasedAt && compareMs ? getPhotosNearMilestone(photos, purchasedAt, compareMs) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <style>{`@media print { aside, nav, .no-print { display: none !important; } }`}</style>

      {/* ── Pre-upload silhouette modal ── */}
      {uploadModalView && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setUploadModalView(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-teal-50 px-5 pt-5 pb-4 text-center">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
                {VIEWS.find(v => v.key === uploadModalView)?.label}
              </p>
              <p className="text-base font-bold text-teal-900 mb-3">Position yourself like this</p>
              <div className="mx-auto" style={{ width: 110, height: 220 }}>
                <PostureSilhouette view={uploadModalView} />
              </div>
            </div>

            <div className="px-5 py-4">
              <ul className="text-sm text-gray-600 space-y-1.5 mb-5">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 font-bold flex-shrink-0">•</span>
                  Stand 6–8 feet from the camera so your full body is visible
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 font-bold flex-shrink-0">•</span>
                  {SILHOUETTE_INSTRUCTIONS[uploadModalView]}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 font-bold flex-shrink-0">•</span>
                  Use good lighting so your body outline is clear
                </li>
              </ul>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => cameraRefs[uploadModalView].current?.click()}
                  className="w-full bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CameraIcon className="w-5 h-5" />
                  Open Camera
                </button>
                <button
                  type="button"
                  onClick={() => fileRefs[uploadModalView].current?.click()}
                  className="w-full bg-white border-2 border-teal-400 hover:border-teal-600 text-teal-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Choose from Library
                </button>
                <button
                  type="button"
                  onClick={() => setUploadModalView(null)}
                  className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My 90-Day Posture Tracker</h1>
        <p className="text-gray-500 text-sm mb-4">Upload your posture photos every 30 days to track your transformation</p>

        {purchasedAt && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Day {Math.min(currentDay ?? 1, 90)} of 90
                </span>
                <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  {streak}/4 milestones documented
                </span>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5 w-full max-w-xs">
                <div className="bg-teal-500 h-2.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="flex gap-2">
              {MILESTONES.map(ms => {
                const done = purchasedAt ? getPhotosNearMilestone(photos, purchasedAt, ms).length > 0 : false;
                return (
                  <div key={ms} className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl text-xs font-bold ${done ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <span>{done ? "✓" : "○"}</span>
                    <span>Day {ms}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Upload Section ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Photos</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Photo Date</label>
            <input
              type="date"
              value={uploadDate}
              max={todayStr()}
              onChange={e => setUploadDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
            />
            {purchasedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Day {Math.max(1, Math.floor((new Date(uploadDate + "T12:00:00").getTime() - new Date(purchasedAt).getTime()) / 86_400_000) + 1)} of your program
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any posture observations..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
            />
          </div>
        </div>

        {/* Hidden file inputs — gallery (no capture) */}
        {VIEWS.map(v => (
          <input
            key={`gallery-${v.key}`}
            ref={fileRefs[v.key]}
            type="file"
            accept="image/*,image/heic,image/heif"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(v.key, f);
              e.target.value = "";
            }}
          />
        ))}

        {/* Hidden file inputs — camera (with capture) */}
        {VIEWS.map(v => (
          <input
            key={`camera-${v.key}`}
            ref={cameraRefs[v.key]}
            type="file"
            accept="image/*,image/heic,image/heif"
            capture="environment"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(v.key, f);
              e.target.value = "";
            }}
          />
        ))}

        {/* Three upload boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {VIEWS.map(v => {
            const preview = pendingPreviews[v.key];
            return (
              <div key={v.key}>
                <button
                  type="button"
                  onClick={() => setUploadModalView(v.key)}
                  className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative ${preview ? "border-teal-500" : "border-gray-300 hover:border-teal-400 bg-gray-50"}`}
                  style={preview ? { backgroundImage: `url(${preview})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                  {!preview && (
                    <>
                      <CameraIcon className="w-8 h-8 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-600">{v.label}</span>
                      <span className="text-xs text-gray-400">Tap to upload</span>
                    </>
                  )}
                  {preview && (
                    <span className="absolute inset-0 bg-black/20 flex items-end justify-center pb-2">
                      <span className="text-white text-xs font-bold">{v.label} ✓</span>
                    </span>
                  )}
                </button>
                {preview && (
                  <button onClick={() => clearPending(v.key)} className="mt-1 w-full text-xs text-red-400 hover:text-red-600 text-center">
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !VIEWS.some(v => pendingFiles[v.key])}
          className="w-full bg-teal-500 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {uploading ? "Uploading…" : "Save Photos"}
        </button>
        {uploadMsg && (
          <p className={`mt-3 text-sm text-center font-medium ${uploadMsg === "Photos saved!" ? "text-teal-600" : "text-red-600"}`}>
            {uploadMsg}
          </p>
        )}
      </div>

      {/* ── Analysis Section ── */}
      {analysisPhoto && (
        <div id="analysis-section" className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-900">Posture Analysis</h2>
            <button onClick={() => { setAnalysisPhoto(null); loadedImgRef.current = null; }} className="text-gray-400 hover:text-gray-600 text-sm no-print">Close ×</button>
          </div>

          {/* View-specific tip */}
          {analysisPhoto.view_type && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5 mb-4">
              <p className="text-xs text-teal-800 leading-relaxed">
                <span className="font-bold">Tip: </span>{VIEW_TIPS[analysisPhoto.view_type]}
              </p>
            </div>
          )}

          {/* Tools */}
          <div className="flex flex-wrap gap-2 mb-4 no-print">
            <button
              onClick={() => setShowPlumb(v => !v)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 transition-colors ${showPlumb ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              📏 Plumb Line
            </button>
            <button
              onClick={() => setShowHoriz(v => !v)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 transition-colors ${showHoriz ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              ⬌ Shoulder Level
            </button>
            <button
              onClick={() => setShowHoriz2(v => !v)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 transition-colors ${showHoriz2 ? "border-purple-400 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              ⬌ Hip Level
            </button>
            <button
              onClick={() => setShowOverlay(v => !v)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 transition-colors ${showOverlay ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              👤 Ideal Overlay
            </button>
            {showOverlay && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Opacity</span>
                <input type="range" min={10} max={80} value={overlayOpacity} onChange={e => setOverlayOpacity(Number(e.target.value))} className="w-20 accent-teal-500" />
                <span>{overlayOpacity}%</span>
              </div>
            )}
            <button onClick={handleDownload} className="ml-auto text-xs font-semibold px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
              ⬇ Save Analysis
            </button>
          </div>

          <div className="rounded-xl overflow-hidden bg-black flex justify-center" style={{ maxHeight: 520 }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={533}
              className="w-full h-auto"
              style={{ cursor: dragging ? "grabbing" : (showPlumb || showHoriz || showHoriz2 ? "grab" : "default"), maxHeight: 520 }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            {showPlumb && "Red dashed: drag to align with ear → shoulder → hip → ankle. "}
            {showHoriz && "Blue dashed: drag to check shoulder levelness. "}
            {showHoriz2 && "Purple dashed: drag to check hip levelness. "}
            {showOverlay && "Green outline: ideal posture reference at adjustable opacity. "}
            {!showPlumb && !showHoriz && !showHoriz2 && !showOverlay && "Enable tools above to analyze your posture."}
          </p>
        </div>
      )}

      {/* ── 90-Day Timeline ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">90-Day Timeline</h2>
        <p className="text-sm text-gray-500 mb-5">Your posture transformation at each milestone</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MILESTONES.map(ms => {
            const msPhotos = purchasedAt ? getPhotosNearMilestone(photos, purchasedAt, ms) : [];
            const msDate = purchasedAt ? milestoneDateStr(purchasedAt, ms) : null;
            const hasPhotos = msPhotos.length > 0;
            const isPast = msDate ? new Date(msDate + "T12:00:00") <= new Date() : false;
            const du = msDate ? daysUntilDate(msDate) : null;

            return (
              <div key={ms} className={`rounded-2xl border-2 p-4 ${hasPhotos ? "border-teal-500" : "border-gray-200"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`text-sm font-bold ${hasPhotos ? "text-teal-700" : "text-gray-700"}`}>Day {ms} Milestone</p>
                    {msDate && <p className="text-xs text-gray-400 mt-0.5">{formatDateDisplay(msDate)}</p>}
                  </div>
                  {hasPhotos && (
                    <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                      {msPhotos.length} photo{msPhotos.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {hasPhotos ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {VIEWS.map(v => {
                        const photo = msPhotos.find(p => p.view_type === v.key);
                        return (
                          <div key={v.key} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 relative group">
                            {photo?.signed_url ? (
                              <>
                                <img src={photo.signed_url} alt={v.label} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 no-print">
                                  <button
                                    onClick={() => openAnalysis(photo)}
                                    className="bg-white text-teal-700 text-xs font-bold px-2 py-1 rounded shadow"
                                  >
                                    Analyze
                                  </button>
                                  <button
                                    onClick={() => handleDelete(photo.id)}
                                    className="bg-white text-red-500 text-xs font-bold px-2 py-1 rounded shadow"
                                  >
                                    Del
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-1">{v.label}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {ms > 1 && day1Photos.length > 0 && (
                      <button
                        onClick={() => setCompareMs(compareMs === ms ? null : ms)}
                        className="w-full text-xs font-semibold text-teal-600 hover:text-teal-800 border border-teal-200 rounded-lg py-2 transition-colors no-print"
                      >
                        {compareMs === ms ? "Hide comparison" : "Compare with Day 1 →"}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center py-5 text-center">
                    <CameraIcon className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      {isPast
                        ? `Upload photos for Day ${ms}`
                        : du !== null && du > 0
                        ? `${du} day${du !== 1 ? "s" : ""} away`
                        : `Day ${ms} photos`}
                    </p>
                    {isPast && (
                      <button
                        onClick={() => { if (msDate) setUploadDate(msDate); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="mt-2 text-xs text-teal-600 hover:underline no-print"
                      >
                        Upload now →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Comparison View ── */}
      {compareMs !== null && day1Photos.length > 0 && comparePhotos.length > 0 && (
        <div className="bg-white border border-teal-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Day 1 → Day {compareMs} Comparison</h2>
            <button onClick={() => setCompareMs(null)} className="text-gray-400 hover:text-gray-600 text-sm no-print">Close ×</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {([{ label: "Day 1", ps: day1Photos }, { label: `Day ${compareMs}`, ps: comparePhotos }]).map(({ label, ps }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
                <div className="grid grid-cols-3 gap-1">
                  {VIEWS.map(v => {
                    const photo = ps.find(p => p.view_type === v.key);
                    return (
                      <div key={v.key} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                        {photo?.signed_url
                          ? <img src={photo.signed_url} alt={v.label} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-1">{v.label}</div>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Accountability Section ── */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
        <h2 className="text-base font-bold text-teal-900 mb-4">📅 Your Next Milestone</h2>
        {purchasedAt && nextMilestone ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-teal-800 font-semibold">Day {nextMilestone} milestone photos</p>
              <p className="text-teal-600 text-sm mt-0.5">
                {daysUntilNext === 0 ? "Today is the day — upload your photos now!" :
                 daysUntilNext === 1 ? "Tomorrow! Get ready." :
                 `${daysUntilNext} days from now — ${formatDateDisplay(milestoneDateStr(purchasedAt, nextMilestone))}`}
              </p>
              <p className="text-teal-600/70 text-xs mt-2">
                {streak === 0 && "Start your transformation — upload your Day 1 photos today!"}
                {streak === 1 && "Great start! Your body is already adapting. Keep going."}
                {streak === 2 && "Halfway there — the improvements are building every day."}
                {streak === 3 && "Almost complete — one more milestone to capture your transformation."}
                {streak === 4 && "You did it! 90 days documented. Your posture journey is complete."}
              </p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors no-print"
            >
              Upload Photos Now →
            </button>
          </div>
        ) : !purchasedAt ? (
          <p className="text-teal-700 text-sm">Start by uploading your Day 1 photos above to begin tracking your transformation.</p>
        ) : (
          <p className="text-teal-700 text-sm font-semibold">🎉 You have completed all 90 days of posture tracking!</p>
        )}
      </div>
    </div>
  );
}
