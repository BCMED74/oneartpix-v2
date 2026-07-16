"use client";

/* ============================================================
   ONEARTPIX — PORTE PRIVÉE
   Écran de saisie du code d'accès.
   Volontairement nu : aucune marque, aucun indice.
   ============================================================ */

import { useState } from "react";

export default function PrivateGate() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  /* === SOUMISSION === */
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
      if (r.ok) {
        window.location.reload();
        return;
      }
      setError(true);
      setCode("");
    } catch {
      setError(true);
    }
    setBusy(false);
  }

  return (
    <main className="gate">
      <div className="box">
        <div className="ring">O</div>

        <input
          type="password"
          value={code}
          autoFocus
          autoComplete="off"
          placeholder="Code"
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        <button onClick={submit} disabled={busy}>
          {busy ? "…" : "Entrer"}
        </button>

        {error && <p className="err">Code incorrect</p>}
      </div>

      {/* === STYLES === */}
      <style jsx>{`
        .gate {
          min-height: 100vh;
          background: #0e1116;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .box {
          width: 100%;
          max-width: 300px;
          text-align: center;
        }
        .ring {
          width: 56px;
          height: 56px;
          margin: 0 auto 32px;
          border: 1px solid #c9a96e;
          border-radius: 50%;
          color: #c9a96e;
          font-size: 22px;
          line-height: 54px;
          letter-spacing: 0.02em;
        }
        input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #2a2f38;
          color: #f4f2ed;
          font-family: inherit;
          font-size: 15px;
          letter-spacing: 0.28em;
          text-align: center;
          padding: 12px 0;
          outline: none;
          transition: border-color 0.3s ease;
        }
        input:focus {
          border-bottom-color: #c9a96e;
        }
        input::placeholder {
          color: #6b6a65;
          letter-spacing: 0.14em;
        }
        button {
          margin-top: 28px;
          background: transparent;
          border: 1px solid #2a2f38;
          color: #9a9892;
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 12px 30px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        button:hover:not(:disabled) {
          border-color: #c9a96e;
          color: #c9a96e;
        }
        button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .err {
          margin-top: 20px;
          color: #6b6a65;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
      `}</style>
    </main>
  );
}
