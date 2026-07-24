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
          pointerEvents: "none",
        }}>
          <span style={{
            display: "inline-block",
            background: open ? GOLD : "transparent",
            border: "1px solid " + GOLD,
            color: open ? DARK : WHITE,
            fontSize: "14px", fontWeight: 400,
            letterSpacing: "0.26em", textTransform: "uppercase",
            padding: "17px 40px", whiteSpace: "nowrap",
            transition: "background .35s ease, color .35s ease",
          }}>
            {open ? "Close" : "Enter with a code"}
          </span>
        </div>
      </div>

      {/* === PANEL === */}
      <div style={{
        overflow: "hidden",
        maxHeight: open ? "320px" : "0px",
        transition: "max-height .55s cubic-bezier(0.4,0,0.2,1)",
        background: DARK,
        borderBottom: open ? "1px solid " + LINE : "none",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "44px 5vw 50px", textAlign: "center" }}>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>

            {/* --- masked field + eye --- */}
            <div style={{ position: "relative", flex: "1 1 320px", display: "flex" }}>
              <input
                type={show ? "text" : "password"}
                value={code}
                placeholder="RESERVE-XXX-XXXXXX"
                autoComplete="off"
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                style={{
                  width: "100%", background: "transparent", border: "1px solid " + LINE,
                  color: WHITE, fontFamily: "inherit", fontSize: "16px", letterSpacing: "0.18em",
                  textAlign: "center", padding: "17px 46px 17px 18px", outline: "none", boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide code" : "Show code"}
                title={show ? "Hide code" : "Show code"}
                style={{
                  position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: show ? GOLD : DIM,
                  cursor: "pointer", padding: "8px", display: "flex", alignItems: "center",
                }}
              >
                <Eye off={!show} />
              </button>
            </div>

            <button onClick={submit} disabled={busy || !code.trim()}
              style={{
                background: "transparent", border: "1px solid " + GOLD, color: WHITE,
                fontFamily: "inherit", fontSize: "14px", letterSpacing: "0.24em",
                textTransform: "uppercase", padding: "17px 38px",
                cursor: busy ? "default" : "pointer",
                opacity: busy || !code.trim() ? 0.35 : 1,
              }}>
              {busy ? "…" : "Enter"}
            </button>
          </div>

          {error ? (
            <p style={{ color: GREY, fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", margin: "22px 0 0" }}>
              Invalid or expired code
            </p>
          ) : null}

          {/* --- second path --- */}
          <div style={{ marginTop: "34px", paddingTop: "28px", borderTop: "1px solid #1c2129" }}>
            <p style={{ color: GREY, fontSize: "13px", margin: "0 0 14px" }}>No code yet?</p>
            <button onClick={() => setModal(true)}
              style={{
                background: "none", border: "1px solid " + LINE, color: GOLD,
                fontFamily: "inherit", fontSize: "12px", letterSpacing: "0.24em",
                textTransform: "uppercase", padding: "13px 30px", cursor: "pointer",
              }}>
              Request a private code
            </button>
          </div>

        </div>
      </div>

      {/* === MODAL === */}
      {modal ? (
        <div onClick={() => setModal(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(8,10,13,0.94)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: "480px", background: "#0e1116", border: "1px solid " + LINE, padding: "44px 40px" }}>
            <button onClick={() => setModal(false)} aria-label="Close"
              style={{ position: "absolute", top: "16px", right: "18px", background: "none", border: "none", color: DIM, fontSize: "22px", lineHeight: 1, cursor: "pointer", padding: "4px" }}>
              ×
            </button>
            <AccessRequest scope="RESERVE" title="Request a private code" />
          </div>
        </div>
      ) : null}

    </div>
  );
}
