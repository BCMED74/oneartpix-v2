"use client";

/* ============================================================
   ONEARTPIX — GÉNÉRATEUR DE CODES (admin)
   Gauche : recherche avec suggestions + génération
   Droite : tous les dossiers classés (Perso / Clients / OAP)
   Styles EN LIGNE : fiables avec Turbopack.
   ============================================================ */

import { useState } from "react";

type Item = { slug: string; title: string; scope: string; family: string };

/* === LES 3 CATÉGORIES === */
const FAMILIES = [
  { key: "perso",  label: "Perso" },
  { key: "client", label: "Clients" },
  { key: "theme",  label: "OAP Private Gallery" },
];

/* === PALETTE === */
const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const GREY = "#9a9892";
const DIM = "#6b6a65";
const LINE = "#2a2f38";
const LINE2 = "#1c2129";

/* === STYLES RÉUTILISABLES === */
const S = {
  label: { color: GREY, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" as const, margin: "34px 0 12px" },
  input: { width: "100%", background: "transparent", border: "1px solid " + LINE, color: WHITE, fontFamily: "inherit", fontSize: "15px", padding: "13px 15px", outline: "none", boxSizing: "border-box" as const },
  row: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", borderBottom: "1px solid " + LINE2, fontFamily: "inherit", padding: "13px 2px", cursor: "pointer", textAlign: "left" as const },
};

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
    ? folders.filter(function (f) {
        return f.title.toLowerCase().indexOf(q) >= 0 || f.slug.toLowerCase().indexOf(q) >= 0 || f.scope.toLowerCase().indexOf(q) >= 0;
      }).slice(0, 6)
    : [];

  /* === SÉLECTION D'UN DOSSIER === */
  function pick(f: Item) {
    setScope(f.scope);
    setQuery("");
    setCode("");
    setCopied(false);
  }

  /* === GÉNÉRATION DU CODE === */
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

  /* === COPIE === */
  function copy() {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", color: WHITE, padding: "90px 5vw 120px" }}>

      <a href="/private" style={{ display: "inline-block", color: DIM, textDecoration: "none", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "28px" }}>‹ Galerie</a>
      <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 14px" }}>Privé</p>
      <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, margin: "0 0 56px" }}>Générer un code</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "72px", alignItems: "flex-start", maxWidth: "1200px" }}>

        {/* ============ COLONNE GAUCHE ============ */}
        <section style={{ flex: "1 1 380px", minWidth: "300px" }}>

          {/* --- Recherche --- */}
          <p style={{ ...S.label, marginTop: 0 }}>Chercher un dossier</p>
          <div style={{ position: "relative" }}>
            <input type="text" value={query} placeholder="tape A, 26, villa…" style={S.input} onChange={(e) => { setQuery(e.target.value); setCode(""); }} />
            {suggestions.length > 0 ? (
              <div style={{ position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)", background: "#161a21", border: "1px solid " + LINE, zIndex: 30 }}>
                {suggestions.map(function (f) {
                  return (
                    <button key={f.slug} style={{ ...S.row, color: WHITE, padding: "12px 15px" }} onClick={() => pick(f)}>
                      <span style={{ fontSize: "14px" }}>{f.title}</span>
                      <span style={{ color: DIM, fontSize: "10px", letterSpacing: "0.2em" }}>{f.scope}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* --- Portée --- */}
          <p style={S.label}>Portée du code</p>
          <input type="text" value={scope} placeholder="VILLA, DUPONT, SNOW…" style={{ ...S.input, letterSpacing: "0.16em" }} onChange={(e) => { setScope(e.target.value.toUpperCase()); setCode(""); }} />
          <p style={{ color: DIM, fontSize: "11px", margin: "10px 0 0" }}>Majuscules, sans espace. Doit correspondre à la portée d’un dossier.</p>

          {/* --- Durée --- */}
          <p style={S.label}>Durée</p>
          <select value={days} style={{ ...S.input, cursor: "pointer" }} onChange={(e) => { setDays(Number(e.target.value)); setCode(""); }}>
            <option value={7} style={{ background: "#0e1116" }}>7 jours</option>
            <option value={15} style={{ background: "#0e1116" }}>15 jours</option>
            <option value={30} style={{ background: "#0e1116" }}>30 jours</option>
            <option value={90} style={{ background: "#0e1116" }}>90 jours</option>
          </select>

          {/* --- Bouton --- */}
          <button onClick={generate} disabled={busy || !scope.trim()} style={{ marginTop: "40px", background: "transparent", border: "1px solid " + GOLD, color: WHITE, fontFamily: "inherit", fontSize: "13px", letterSpacing: "0.22em", textTransform: "uppercase", padding: "15px 34px", cursor: busy ? "default" : "pointer", opacity: busy || !scope.trim() ? 0.35 : 1 }}>
            {busy ? "…" : "Générer"}
          </button>

          {/* --- Résultat --- */}
          {code ? (
            <div style={{ marginTop: "44px", border: "1px solid " + LINE, padding: "28px" }}>
              <p style={{ ...S.label, marginTop: 0 }}>Code à transmettre</p>
              <p style={{ color: GOLD, fontSize: "26px", letterSpacing: "0.14em", margin: "14px 0 20px", userSelect: "all", wordBreak: "break-all" }}>{code}</p>
              <button onClick={copy} style={{ background: "transparent", border: "1px solid " + LINE, color: GREY, fontFamily: "inherit", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer" }}>{copied ? "Copié" : "Copier"}</button>
            </div>
          ) : null}

        </section>

        {/* ============ COLONNE DROITE : TOUS LES DOSSIERS ============ */}
        <aside style={{ flex: "1 1 380px", minWidth: "300px" }}>
          {FAMILIES.map(function (fam) {
            const list = folders.filter(function (f) { return f.family === fam.key; });
            return (
              <div key={fam.key} style={{ marginBottom: "44px" }}>
                <p style={{ display: "flex", alignItems: "center", gap: "12px", color: GOLD, fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", margin: "0 0 14px", paddingBottom: "12px", borderBottom: "1px solid " + LINE }}>
                  {fam.label}<span style={{ color: DIM, letterSpacing: "0.1em" }}>{list.length}</span>
                </p>
                {list.length === 0 ? <p style={{ color: DIM, fontSize: "13px", margin: "12px 0 0" }}>Aucun dossier</p> : null}
                {list.map(function (f) {
                  const on = f.scope === scope;
                  return (
                    <button key={f.slug} onClick={() => pick(f)} style={{ ...S.row, color: on ? GOLD : WHITE }}>
                      <span style={{ fontSize: "14px" }}>{f.title}</span>
                      <span style={{ color: on ? GOLD : DIM, fontSize: "10px", letterSpacing: "0.2em" }}>{f.scope}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </aside>

      </div>
    </main>
  );
}
