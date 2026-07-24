"use client";

/* ============================================================
   ONEARTPIX — GÉNÉRATEUR DE CODES (interface)
   1. Recherche un dossier (nom, slug, date type 2601_15_...)
   2. Clique dessus → sa portée se remplit
   3. Ou saisis une portée libre (nom client, référence…)
   4. Choisis la durée → Générer
   ============================================================ */

import { useState } from "react";

type Item = { slug: string; title: string; scope: string; family: string };

export default function AdminCodes({ folders }: { folders: Item[] }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(folders[0] ? folders[0].scope : "");
  const [days, setDays] = useState(15);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  /* === RECHERCHE : titre, slug ou portée === */
  const q = query.trim().toLowerCase();
  const found = q
    ? folders.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.slug.toLowerCase().includes(q) ||
          f.scope.toLowerCase().includes(q)
      )
    : folders;

  /* === GÉNÉRATION === */
  async function generate() {
    const s = scope.trim();
    if (!s || busy) return;
    setBusy(true);
    setCode("");
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
  }

  return (
    <main className="wrap">
      <a className="back" href="/private">‹ Galerie</a>
      <p className="eyebrow">Privé</p>
      <h1>Générer un code</h1>

      {/* === RECHERCHE DE DOSSIER === */}
      <p className="lbl">Chercher un dossier</p>
      <input className="search" type="text" value={query} placeholder="nom, slug ou 2601_15_…" onChange={(e) => setQuery(e.target.value)} />

      <div className="list">
        {found.length === 0 ? <p className="none">Aucun dossier</p> : null}
        {found.map((f) => (
          <button key={f.slug} className={f.scope === scope ? "row on" : "row"} onClick={() => setScope(f.scope)}>
            <span className="t">{f.title}</span>
            <span className="s">{f.scope}</span>
          </button>
        ))}
      </div>

      {/* === PORTÉE (libre) === */}
      <p className="lbl">Portée du code</p>
      <input className="scope" type="text" value={scope} placeholder="VILLA, DUPONT, SNOW…" onChange={(e) => setScope(e.target.value.toUpperCase())} />
      <p className="hint">Majuscules, sans espace. Doit correspondre à la portée d’un dossier.</p>

      {/* === DURÉE === */}
      <p className="lbl">Durée</p>
      <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
        <option value={7}>7 jours</option>
        <option value={15}>15 jours</option>
        <option value={30}>30 jours</option>
        <option value={90}>90 jours</option>
      </select>

      <button className="go" onClick={generate} disabled={busy}>{busy ? "…" : "Générer"}</button>

      {code ? (
        <div className="out">
          <p className="lbl">Code à transmettre</p>
          <p className="code">{code}</p>
          <button className="copy" onClick={copy}>Copier</button>
        </div>
      ) : null}

      <style jsx>{`
        .wrap { min-height: 100vh; background: #0e1116; color: #f4f2ed; padding: 90px 5vw 120px; max-width: 620px; }
        .back { display: inline-block; color: #6b6a65; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 28px; }
        .back:hover { color: #c9a96e; }
        .eyebrow { color: #c9a96e; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 14px; }
        h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 300; margin: 0 0 48px; }
        .lbl { color: #9a9892; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; margin: 36px 0 12px; }
        .search, .scope { width: 100%; background: transparent; border: 1px solid #2a2f38; color: #f4f2ed; font-family: inherit; font-size: 15px; padding: 13px 15px; outline: none; transition: border-color 0.3s ease; }
        .search:focus, .scope:focus { border-color: #c9a96e; }
        .scope { letter-spacing: 0.16em; }
        .hint { color: #6b6a65; font-size: 11px; margin: 10px 0 0; }
        .list { margin-top: 16px; border-top: 1px solid #1c2129; }
        .none { color: #6b6a65; font-size: 13px; padding: 16px 0; margin: 0; }
        .row { width: 100%; display: flex; align-items: center; justify-content: space-between; background: transparent; border: none; border-bottom: 1px solid #1c2129; color: #f4f2ed; font-family: inherit; padding: 14px 2px; cursor: pointer; text-align: left; transition: color 0.25s ease; }
        .row:hover { color: #c9a96e; }
        .row.on .t { color: #c9a96e; }
        .t { font-size: 14px; }
        .s { color: #6b6a65; font-size: 10px; letter-spacing: 0.2em; }
        .row.on .s { color: #c9a96e; }
        select { width: 100%; background: transparent; border: 1px solid #2a2f38; color: #f4f2ed; font-family: inherit; font-size: 15px; padding: 13px 15px; outline: none; cursor: pointer; }
        select option { background: #0e1116; }
        .go { margin-top: 40px; background: transparent; border: 1px solid #c9a96e; color: #f4f2ed; font-family: inherit; font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; padding: 15px 34px; cursor: pointer; transition: all 0.3s ease; }
        .go:hover:not(:disabled) { background: #c9a96e; color: #0e1116; }
        .go:disabled { opacity: 0.4; }
        .out { margin-top: 48px; border: 1px solid #2a2f38; padding: 28px; }
        .code { color: #c9a96e; font-size: 26px; letter-spacing: 0.14em; margin: 0 0 20px; user-select: all; word-break: break-all; }
        .copy { background: transparent; border: 1px solid #2a2f38; color: #9a9892; font-family: inherit; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; padding: 10px 20px; cursor: pointer; }
        .copy:hover { border-color: #c9a96e; color: #c9a96e; }
      `}</style>
    </main>
  );
}
