"use client";

/* ============================================================
   ONEARTPIX — BARCODE GATE
   Label → barcode → click opens two paths:
   · enter an existing access code
   · request one (opens a modal)
   ============================================================ */

import { useEffect, useState } from "react";
import AccessRequest from "@/components/AccessRequest";

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const DIM = "#6b6a65";
const LINE = "#2a2f38";

/* Relative widths. 0 = dark separator. Fixed rhythm. */
const WIDTHS = [
  26, 0, 11, 0, 42, 0, 9, 0, 18, 0, 31, 0, 8, 12, 0, 24,
  0, 15, 0, 38, 0, 10, 0, 21, 0, 13, 0, 29, 0, 16, 0, 11,
  0, 34, 0, 9, 0, 19, 0, 27, 0, 7, 0, 23, 0, 14, 0, 36,
];

/* Framing offsets: every band shows a different slice. */
const SHIFTS = [8, 62, 31, 88, 17, 74, 45, 96, 23, 57, 12, 81, 39, 68, 5, 92];

export default function ReserveBarcode({ images }: { images: string[] }) {
  const [hot, setHot] = useState(false);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState("");
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

      {/* === LABEL === */}
      <div style={{ textAlign: "center", padding: "0 5vw 26px" }}>
        <p style={{ color: GOLD, fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 8px" }}>
          Enter with a code
        </p>
        <p style={{ color: DIM, fontSize: "11px", letterSpacing: "0.14em", margin: 0 }}>
          {open ? "Close" : "Click the barcode"}
        </p>
      </div>

      {/* === BARCODE === */}
      <div
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onClick={() => setOpen(!open)}
        title="Enter with a code"
        style={{
          display: "flex", width: "100%", height: "clamp(180px,26vh,300px)",
          overflow: "hidden", background: "#0b0d11", cursor: "pointer",
          borderTop: "1px solid " + (hot || open ? GOLD : "#1c2129"),
          borderBottom: "1px solid " + (open ? GOLD : "#1c2129"),
          transition: "border-color .5s ease",
        }}
      >
        {WIDTHS.map((w, k) => {
          if (w === 0) return <div key={k} style={{ flex: "5 0 0", background: "#0b0d11" }} />;
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
      </div>

      {/* === PANEL === */}
      <div style={{
        overflow: "hidden",
        maxHeight: open ? "300px" : "0px",
        transition: "max-height .55s cubic-bezier(0.4,0,0.2,1)",
        background: "#0b0d11",
        borderBottom: open ? "1px solid " + LINE : "none",
      }}>
        <div style={{ maxWidth: "620px", margin: "0 auto", padding: "40px 5vw 46px", textAlign: "center" }}>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <input
              type="text"
              value={code}
              placeholder="RESERVE-XXX-XXXXXX"
              autoComplete="off"
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              style={{
                flex: "1 1 300px", background: "transparent", border: "1px solid " + LINE,
                color: WHITE, fontFamily: "inherit", fontSize: "15px", letterSpacing: "0.18em",
                textAlign: "center", padding: "15px 18px", outline: "none", boxSizing: "border-box",
              }}
            />
            <button onClick={submit} disabled={busy || !code.trim()}
              style={{
                background: "transparent", border: "1px solid " + GOLD, color: WHITE,
                fontFamily: "inherit", fontSize: "13px", letterSpacing: "0.22em",
                textTransform: "uppercase", padding: "15px 34px",
                cursor: busy ? "default" : "pointer",
                opacity: busy || !code.trim() ? 0.35 : 1,
              }}>
              {busy ? "…" : "Enter"}
            </button>
          </div>

          {error ? (
            <p style={{ color: DIM, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", margin: "20px 0 0" }}>
              Invalid or expired code
            </p>
          ) : null}

          {/* --- second path --- */}
          <p style={{ color: DIM, fontSize: "13px", margin: "28px 0 0" }}>
            No code yet?{" "}
            <button onClick={() => setModal(true)}
              style={{ background: "none", border: "none", padding: 0, color: GOLD, fontFamily: "inherit", fontSize: "13px", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Request a private code
            </button>
          </p>

        </div>
      </div>

      {/* === MODAL === */}
      {modal ? (
        <div onClick={() => setModal(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(8,10,13,0.94)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: "480px", background: "#0e1116", border: "1px solid " + LINE, padding: "44px 40px" }}>
            <button onClick={() => setModal(false)} aria-label="Close"
              style={{ position: "absolute", top: "16px", right: "18px", background: "none", border: "none", color: DIM, fontSize: "20px", lineHeight: 1, cursor: "pointer", padding: "4px" }}>
              ×
            </button>
            <AccessRequest scope="RESERVE" title="Request a private code" />
          </div>
        </div>
      ) : null}

    </div>
  );
}
