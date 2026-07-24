"use client";

/* ============================================================
   ONEARTPIX — GÉNÉRATEUR DE CODES (interface admin)
   Colonne gauche  : recherche + suggestions + génération
   Colonne droite  : tous les dossiers classés par famille
   ============================================================ */

import { useState } from "react";

type Item = { slug: string; title: string; scope: string; family: string };

/* === LIBELLÉS DES FAMILLES === */
const FAMILIES: { key: string; label: string }[] = [
  { key: "perso",  label: "Perso" },
  { key: "client", label: "Clients" },
  { key: "theme",  label: "OAP Private Gallery" },
];

export default function AdminCodes({ folders }: { folders: Item[] }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("");
  const [days, setDays] = useState(15);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  /* === SUGGESTIONS AU FIL DE LA FRAPPE === */
  const q = query.trim().toLowerCase();
  const suggestions = q
    ? folders
        .filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.slug.toLowerCase().includes(q) ||
            f.scope.toLowerCase().includes(q)
        )
        .slice(0, 6)
    : [];

  /* === CHOISIR UN DOSSIER === */
  function pick(f: Item) {
    setScope(f.scope);
    setQuery(f.title);
    setCode("");
  }

  /* === GÉNÉRATION === */
  async function generate() {
    const s = scope.trim();
    if (!s || busy) return;
    setBusy(true);
    setCode("");
    setCopied(false);
    try {
      const r = await fetch("/api/private/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: s, days: days }),
      });
      const d = await r.json();
      if (d && d.code) setCode(d.code);
    } catch {
      setCode("");
    }
    setBusy(false);
  }

  /* === COPIER === */
  function copy() {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
  }

  return (
    <main className="wrap">
      <a className="back" href="/private">‹ Galerie</a>
      <p className="eyebrow">Privé</p>
      <h1>Générer un code</h1>

      <div className="cols">

        {/* ========== COLONNE GAUCHE : GÉNÉRATEUR ========== */}
        <section className="left">

          <p className="lbl">Chercher un dossier</p>
          <div className="field">
            <input type="text" value={query} placeholder="nom, slug ou 2601_15_…" onChange={(e) => { setQuery(e.target.value); setCode(""); }} />
            {suggestions.length > 0 ? (
              <div className="sug">
                {suggestions.map((f) => (
                  <button key={f.slug} className="sugrow" onClick={() => pick(f)}>
                    <span className="st">{f.title}</span>
                    <span className="ss">{f.scope}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <p className="lbl">Portée du code</p>
          <input className="scope" type="text" value={scope} placeholder="VILLA, DUPONT, SNOW…" onChange={(e) => { setScope(e.target.value.toUpperCase());
