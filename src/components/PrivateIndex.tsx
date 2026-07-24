"use client";

/* ============================================================
   ONEARTPIX — PRIVATE INDEX
   Folders grouped by family. Section headers only appear when
   more than one group is visible: a client seeing a single
   project gets a clean page, no administrative scaffolding.
   ============================================================ */

import type { PrivateFolder } from "@/data/private";

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const GREY = "#9a9892";
const DIM = "#6b6a65";
const LINE = "#2a2f38";

/* Display order and labels. */
const FAMILIES: { key: string; label: string }[] = [
  { key: "theme",  label: "The Reserve" },
  { key: "client", label: "Client projects" },
  { key: "perso",  label: "Personal" },
];

export default function PrivateIndex({ folders, isMaster = false }: { folders: PrivateFolder[]; isMaster?: boolean }) {

  /* === LOCK === */
  async function lock() {
    await fetch("/api/private", { method: "DELETE" });
    window.location.href = "/";
  }

  /* Groups that actually contain something. */
  const groups = FAMILIES
    .map((f) => ({ ...f, list: folders.filter((x) => x.family === f.key) }))
    .filter((g) => g.list.length > 0);

  const showHeaders = groups.length > 1;

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", color: WHITE, padding: "90px 5vw 120px" }}>

      {/* === HEADER === */}
      <header style={{ position: "relative", marginBottom: "64px" }}>
        <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 14px" }}>
          Private
        </p>
        <h1 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 300, letterSpacing: "-0.01em", margin: 0 }}>
          Gallery
        </h1>

        {isMaster ? (
          <a href="/private/admin" style={{ display: "inline-block", marginTop: "18px", border: "1px solid " + GOLD, color: WHITE, fontSize: "13px", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", padding: "13px 26px" }}>
            Generate a code
          </a>
        ) : null}

        <button onClick={lock}
          style={{ position: "absolute", top: 0, right: 0, background: "transparent", border: "1px solid " + LINE, color: DIM, fontFamily: "inherit", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "9px 18px", cursor: "pointer" }}>
          Lock
        </button>
      </header>

      {/* === GROUPS === */}
      {groups.map((g) => (
        <section key={g.key} style={{ marginBottom: "72px" }}>

          {showHeaders ? (
            <p style={{ display: "flex", alignItems: "center", gap: "14px", color: GOLD, fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", margin: "0 0 28px", paddingBottom: "14px", borderBottom: "1px solid " + LINE }}>
              {g.label}
              <span style={{ color: DIM, letterSpacing: "0.1em" }}>{g.list.length}</span>
            </p>
          ) : null}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "48px 36px" }}>
            {g.list.map((f) => (
              <a key={f.slug} href={"/private/" + f.slug} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "#161a21", marginBottom: "20px" }}>
                  <img src={f.cover} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h2 style={{ fontSize: "17px", fontWeight: 400, margin: "0 0 6px" }}>{f.title}</h2>
                {f.subtitle ? <p style={{ color: GREY, fontSize: "13px", margin: "0 0 8px" }}>{f.subtitle}</p> : null}
                <p style={{ color: DIM, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
                  {f.photos.length} {f.photos.length > 1 ? "images" : "image"}
                  {f.downloadable ? " · download" : ""}
                </p>
              </a>
            ))}
          </div>

        </section>
      ))}

    </main>
  );
}
