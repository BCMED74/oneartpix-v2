"use client";

/* ============================================================
   ONEARTPIX — PRIVATE GATE
   Bare code entry screen. No branding, no clue.
   Masked by default, eye toggle to reveal.
   Inline styles: reliable with Turbopack.
   ============================================================ */

import { useState } from "react";

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const GREY = "#9a9892";
const DIM = "#6b6a65";
const LINE = "#2a2f38";

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

export default function PrivateGate() {
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  /* === SUBMIT === */
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
      if (r.ok) { window.location.reload(); return; }
      setError(true);
      setCode("");
    } catch {
      setError(true);
    }
    setBusy(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "320px", textAlign: "center" }}>

        {/* --- gold ring --- */}
        <div style={{ width: "56px", height: "56px", margin: "0 auto 32px", border: "1px solid " + GOLD, borderRadius: "50%", color: GOLD, fontSize: "22px", lineHeight: "54px", letterSpacing: "0.02em" }}>
          O
        </div>

        {/* --- masked field + eye --- */}
        <div style={{ position: "relative", display: "flex" }}>
          <input
            type={show ? "text" : "password"}
            value={code}
            autoFocus
            autoComplete="off"
            placeholder="Code"
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            style={{
              width: "100%", background: "transparent", border: "none",
              borderBottom: "1px solid " + LINE, color: WHITE,
              fontFamily: "inherit", fontSize: "15px", letterSpacing: "0.28em",
              textAlign: "center", padding: "12px 40px 12px 12px", outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide code" : "Show code"}
            title={show ? "Hide code" : "Show code"}
            style={{
              position: "absolute", right: "2px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: show ? GOLD : DIM,
              cursor: "pointer", padding: "8px", display: "flex", alignItems: "center",
            }}
          >
            <Eye off={!show} />
          </button>
        </div>

        {/* --- submit --- */}
        <button onClick={submit} disabled={busy}
          style={{
            marginTop: "28px", background: "transparent", border: "1px solid " + LINE,
            color: GREY, fontFamily: "inherit", fontSize: "11px",
            letterSpacing: "0.22em", textTransform: "uppercase",
            padding: "12px 30px", cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.4 : 1,
          }}>
          {busy ? "…" : "Enter"}
        </button>

        {error ? (
          <p style={{ marginTop: "20px", color: DIM, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Invalid code
          </p>
        ) : null}

      </div>
    </main>
  );
}
