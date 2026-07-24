"use client";

/* ============================================================
   ONEARTPIX — GÉNÉRATEUR DE CODES (interface)
   Choisis une portée + une durée → un code à transmettre.
   ============================================================ */

import { useState } from "react";

export default function AdminCodes({ scopes }: { scopes: string[] }) {
  const [scope, setScope] = useState(scopes[0] || "");
  const [days, setDays] = useState(15);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate() {
    if (!scope || busy) return;
    setBusy(true);
    setCode("");
    try {
      const r = await fetch("/api/private/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: scope, days: days }),
      });
      const d = await r.json();
      if (d && d.code) setCode(d.code);
    } catch {
      setCode("");
    }
    setBusy(false);
  }

  return (
    <main className="wrap">
      <a className="back" href="/private">‹ Galerie</a>
      <p className="eyebrow">Privé</p>
      <h1>Générer un code</h1>

      <div className="row">
        <label>Portée</label>
        <select value={scope} onChange={(e) => setScope(e.target.value)}>
          {scopes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="row">
        <label>Durée</label>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>7 jours</option>
          <option value={15}>15 jours</option>
          <option value={30}>30 jours</option>
          <option value={90}>90 jours</option>
        </select>
      </div>

      <button onClick={generate} disabled={busy}>{busy ? "…" : "Générer"}</button>

      {code ? (
        <div className="out">
          <p className="lbl">Code à transmettre</p>
          <p className="code">{code}</p>
        </div>
      ) : null}

      <style jsx>{`
        .wrap { min-height: 100vh; background: #0e1116; color: #f4f2ed; padding: 90px 5vw 120px; max-width: 560px; }
        .back { display: inline-block; color: #6b6a65; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 28px; }
        .back:hover { color: #c9a96e; }
        .eyebrow { color: #c9a96e; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 14px; }
        h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 300; margin: 0 0 48px; }
        .row { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #2a2f38; padding: 16px 0; }
        label { color: #9a9892; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; }
        select { background: transparent; border: none; color: #f4f2ed; font-family: inherit; font-size: 14px; text-align: right; outline: none; cursor: pointer; }
        select option { background: #0e1116; }
        button { margin-top: 36px; background: transparent; border: 1px solid #2a2f38; color: #9a9892; font-family: inherit; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; padding: 13px 32px; cursor: pointer; transition: all 0.3s ease; }
        button:hover:not(:disabled) { border-color: #c9a96e; color: #c9a96e; }
        button:disabled { opacity: 0.4; }
        .out { margin-top: 48px; border: 1px solid #2a2f38; padding: 28px; }
        .lbl { color: #6b6a65; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 14px; }
        .code { color: #c9a96e; font-size: 24px; letter-spacing: 0.14em; margin: 0; user-select: all; }
      `}</style>
    </main>
  );
}
