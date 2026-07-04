"use client";
import { EMAIL, COUNTRY } from "@/data/site";

/* ============================================================
   FOOTER — global (toutes les pages)
   Marque · pays · email · droits réservés
   ============================================================ */

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";

export default function Footer() {
  return (
    <footer style={{ background: "#0b0d11", borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "clamp(44px,6vh,68px) clamp(24px,5vw,72px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexWrap: "wrap",
        gap: "24px 40px", alignItems: "flex-end", justifyContent: "space-between" }}>

        {/* Marque + pays */}
        <div>
          <p style={{ color: WHITE, fontSize: "13px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            OneArtPix
          </p>
          <p style={{ color: "#5a5955", fontSize: "10.5px", letterSpacing: "0.22em", marginTop: "10px", textTransform: "uppercase" }}>
            {COUNTRY}
          </p>
        </div>

        {/* Email + droits */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a href={`mailto:${EMAIL}`}
            style={{ color: GOLD, fontSize: "12.5px", letterSpacing: "0.1em", textDecoration: "none" }}>
            {EMAIL}
          </a>
          <p style={{ color: "#5a5955", fontSize: "9.5px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            © 2026 OneArtPix · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
