"use client";

/* ============================================================
   ONEARTPIX — GRILLE D'UN DOSSIER PRIVÉ
   · lightbox plein écran (flèches, Échap)
   · diaporama automatique (4 s)
   · sélection de photos + téléchargement ZIP
   Styles en ligne : fiables avec Turbopack.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import type { PrivateFolder } from "@/data/private";

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const GREY = "#9a9892";
const DIM = "#6b6a65";
const LINE = "#2a2f38";

const btn = {
  background: "transparent", border: "1px solid " + LINE, color: GREY,
  fontFamily: "inherit", fontSize: "10px", letterSpacing: "0.2em",
  textTransform: "uppercase" as const, padding: "11px 20px", cursor: "pointer",
};

export default function PrivateGrid({ folder }: { folder: PrivateFolder }) {
  const [open, setOpen] = useState<number | null>(null);
  const [play, setPlay] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = folder.photos.length;
  const nameOf = (src: string) => src.split("/").pop() || "";

  /* === CLAVIER === */
  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(null); setPlay(false); }
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % total));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + total) % total));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  /* === DIAPORAMA === */
  useEffect(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    if (play && open !== null) {
      timer.current = setInterval(() => {
        setOpen((i) => (i === null ? null : (i + 1) % total));
      }, 4000);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [play, open, total]);

  /* === SÉLECTION === */
  function toggle(src: string) {
    const n = nameOf(src);
    setPicked((p) => (p.indexOf(n) >= 0 ? p.filter((x) => x !== n) : p.concat(n)));
  }

  /* === TÉLÉCHARGEMENT === */
  async function download(all: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/private/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: folder.slug, names: all ? [] : picked }),
      });
      if (r.ok) {
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = folder.slug + ".zip";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* silence */ }
    setBusy(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", color: WHITE, padding: "90px 5vw 120px" }}>

      {/* === EN-TÊTE === */}
      <header style={{ marginBottom: "48px" }}>
        <a href="/private" style={{ display: "inline-block", color: DIM, textDecoration: "none", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "22px" }}>‹ Galerie</a>
        <h1 style={{ fontSize: "clamp(28px,4.4vw,46px)", fontWeight: 300, margin: "0 0 8px" }}>{folder.title}</h1>
        {folder.subtitle ? <p style={{ color: GREY, fontSize: "14px", margin: 0 }}>{folder.subtitle}</p> : null}
      </header>

      {/* === BARRE D'ACTIONS === */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "44px", paddingBottom: "28px", borderBottom: "1px solid " + LINE }}>
        <button style={btn} onClick={() => { setOpen(0); setPlay(true); }}>Diaporama</button>

        {folder.downloadable ? (
          <>
            <button style={{ ...btn, borderColor: GOLD, color: WHITE }} onClick={() => download(true)} disabled={busy}>
              {busy ? "…" : "Tout télécharger"}
            </button>
            {picked.length > 0 ? (
              <button style={{ ...btn, borderColor: GOLD, color: GOLD }} onClick={() => download(false)} disabled={busy}>
                Télécharger {picked.length}
              </button>
            ) : null}
            <span style={{ color: DIM, fontSize: "11px", marginLeft: "6px" }}>
              Cliquez le rond d’une photo pour la sélectionner
            </span>
          </>
        ) : null}
      </div>

      {/* === GRILLE === */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "44px 28px" }}>
        {folder.photos.map((p, i) => {
          const on = picked.indexOf(nameOf(p.src)) >= 0;
          return (
            <figure key={p.src} style={{ margin: 0 }}>
              <div style={{ position: "relative", aspectRatio: "3 / 2", background: "#161a21", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-in", border: on ? "1px solid " + GOLD : "1px solid transparent" }}
                onClick={() => { setOpen(i); setPlay(false); }}>
                <img src={p.src} alt={p.title || ""} loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />

                {/* pastille de sélection */}
                {folder.downloadable ? (
                  <button aria-label="Sélectionner"
                    onClick={(e) => { e.stopPropagation(); toggle(p.src); }}
                    style={{ position: "absolute", top: "12px", right: "12px", width: "24px", height: "24px", borderRadius: "50%", border: "1px solid " + (on ? GOLD : "rgba(244,242,237,0.5)"), background: on ? GOLD : "rgba(14,17,22,0.55)", cursor: "pointer", padding: 0 }} />
                ) : null}
              </div>

              {(p.title || p.note) ? (
                <figcaption style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {p.title ? <span style={{ fontSize: "14px" }}>{p.title}</span> : null}
                  {p.note ? <span style={{ fontSize: "11px", color: DIM, letterSpacing: "0.1em" }}>{p.note}</span> : null}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>

      {/* === LIGHTBOX === */}
      {open !== null ? (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(8,10,13,0.97)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
          onClick={() => { setOpen(null); setPlay(false); }}>

          <img src={folder.photos[open].src} alt="" style={{ maxWidth: "92vw", maxHeight: "84vh", objectFit: "contain" }} />

          <div style={{ position: "absolute", bottom: "26px", display: "flex", alignItems: "center", gap: "20px" }} onClick={(e) => e.stopPropagation()}>
            <button style={btn} onClick={() => setOpen((i) => (i === null ? null : (i - 1 + total) % total))}>‹</button>
            <button style={{ ...btn, borderColor: play ? GOLD : LINE, color: play ? GOLD : GREY }} onClick={() => setPlay(!play)}>
              {play ? "Pause" : "Lecture"}
            </button>
            <span style={{ color: DIM, fontSize: "11px", letterSpacing: "0.2em" }}>{open + 1} / {total}</span>
            <button style={btn} onClick={() => setOpen((i) => (i === null ? null : (i + 1) % total))}>›</button>
          </div>
        </div>
      ) : null}

    </main>
  );
}
