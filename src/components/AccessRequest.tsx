"use client";

/* ============================================================
   ONEARTPIX — FORMULAIRE DE DEMANDE D'ACCÈS
   À poser sur n'importe quelle page :  <AccessRequest scope="SNOW" title="Snow" />
   Styles en ligne (fiables avec Turbopack).
   ============================================================ */

import { useState } from "react";

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const GREY = "#9a9892";
const DIM = "#6b6a65";
const LINE = "#2a2f38";

const field = {
  width: "100%", background: "transparent", border: "1px solid " + LINE,
  color: WHITE, fontFamily: "inherit", fontSize: "15px",
  padding: "13px 15px", outline: "none", boxSizing: "border-box" as const,
  marginBottom: "16px",
};

const label = { color: GREY, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" as const, margin: "0 0 10px" };

export default function AccessRequest({ scope, title }: { scope: string; title?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function send() {
    if (!name.trim() || !email.trim() || state === "busy") return;
    setState("busy");
    try {
      const r = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, scope: scope, message: message }),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  /* === CONFIRMATION === */
  if (state === "done") {
    return (
      <div style={{ border: "1px solid " + LINE, padding: "40px", maxWidth: "480px" }}>
        <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 16px" }}>Demande reçue</p>
        <p style={{ color: WHITE, fontSize: "16px", fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
          Merci. Votre demande a bien été transmise. Vous recevrez votre accès par email sous peu.
        </p>
      </div>
    );
  }

  /* === FORMULAIRE === */
  return (
    <div style={{ maxWidth: "480px" }}>
      <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 14px" }}>Sur demande</p>
      <h3 style={{ color: WHITE, fontSize: "24px", fontWeight: 300, margin: "0 0 12px" }}>{title || scope}</h3>
      <p style={{ color: GREY, fontSize: "14px", lineHeight: 1.7, margin: "0 0 32px" }}>
        Cette sélection n’est pas publique. Laissez vos coordonnées, un accès temporaire de 15 jours vous sera transmis.
      </p>

      <p style={label}>Nom</p>
      <input type="text" value={name} style={field} onChange={(e) => setName(e.target.value)} />

      <p style={label}>Email</p>
      <input type="email" value={email} style={field} onChange={(e) => setEmail(e.target.value)} />

      <p style={label}>Message (facultatif)</p>
      <textarea value={message} rows={3} style={{ ...field, resize: "vertical" }} onChange={(e) => setMessage(e.target.value)} />

      <button onClick={send} disabled={state === "busy" || !name.trim() || !email.trim()}
        style={{ marginTop: "12px", background: "transparent", border: "1px solid " + GOLD, color: WHITE, fontFamily: "inherit", fontSize: "13px", letterSpacing: "0.22em", textTransform: "uppercase", padding: "15px 34px", cursor: "pointer", opacity: state === "busy" || !name.trim() || !email.trim() ? 0.35 : 1 }}>
        {state === "busy" ? "…" : "Demander l’accès"}
      </button>

      {state === "error" ? <p style={{ color: DIM, fontSize: "12px", marginTop: "18px" }}>Envoi impossible. Réessayez.</p> : null}
    </div>
  );
}
