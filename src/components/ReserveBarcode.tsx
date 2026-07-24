"use client";

/* ============================================================
   ONEARTPIX — BARCODE GATE
   The barcode runs uninterrupted; a dark frame floats over it,
   holding the gold button. The code field is masked by default,
   with an eye toggle to reveal it.
   ============================================================ */

import { useEffect, useState } from "react";
import AccessRequest from "@/components/AccessRequest";

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const GREY = "#9a9892";
const DIM = "#6b6a65";
const LINE = "#2a2f38";
const DARK = "#0b0d11";

/* Relative widths. 0 = dark separator. Fixed rhythm. */
const WIDTHS = [
  26, 0, 11, 0, 42, 0, 9, 0, 18, 0, 31, 0, 8, 12, 0, 24,
  0, 15, 0, 38, 0, 10, 0, 21, 0, 13, 0, 29, 0, 16, 0, 11,
  0, 34, 0, 9, 0, 19, 0, 27, 0, 7, 0, 23, 0, 14, 0, 36,
];

/* Framing offsets: every band shows a different slice. */
const SHIFTS = [8, 62, 31, 88, 17, 74, 45, 96, 23, 57, 12, 81, 39, 68, 5, 92];

/* === EYE ICON === */
function Eye({ off }: { off: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <line x1="3" y1="21" x2="21" y2="3" /> : null}
    </svg>
  );
}

export default function ReserveBarcode({ images }: { images: string[] }) {
  const [hot, setHot] = useState(false);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  /* Escape closes the modal. */
  useEffect(() => {
    if (!modal) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setModal(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  if (images.length === 0) return null;

  /* === CODE CHECK === */
  async function submit() {
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(false);
    try {
      const r = await fetch("/api/private", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (r.ok) { window.location.href = "/private"; return; }
      setError(true);
      setCode("");
    } catch {
      setError(true);
    }
    setBusy(false);
  }

  let bar = 0; // counts photo bands only

  return (
    <div>

      {/* === BARCODE (uninterrupted) === */}
      <div
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onClick={() => setOpen(!open)}
        title="Enter with a code"
        style={{
          position: "relative",
          display: "flex", width: "100%", height: "clamp(240px,36vh,400px)",
          overflow: "hidden", background: DARK, cursor: "pointer",
          borderTop: "1px solid " + (hot || open ? GOLD : "#1c2129"),
          borderBottom: "1px solid " + (open ? GOLD : "#1c2129"),
          transition: "border-color .5s ease",
        }}
      >
        {/* --- the bands --- */}
        {WIDTHS.map((w, k) => {
          if (w === 0) return <div key={k} style={{ flex: "5 0 0", background: DARK }} />;
          const src = images[bar % images.length];
          const shift = SHIFTS[bar % SHIFTS.length];
          bar++;
          return (
            <div key={k} style={{
              flex: w + " 0 0",
              backgroundImage: "url(" + src + ")",
              backgroundSize: "cover",
              backgroundPosition: shift + "% center",
              filter: hot || open ? "grayscale(0) brightness(1)" : "grayscale(0.75) brightness(0.7)",
              transition: "filter 1.1s cubic-bezier(0.2,0.8,0.2,1)",
            }} />
          );
        })}

        {/* --- floating frame --- */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: DARK,
          border: "1px solid #1c2129",
          padding: "clamp(30px,5vh,52px) clamp(44px,8vw,110px)",
