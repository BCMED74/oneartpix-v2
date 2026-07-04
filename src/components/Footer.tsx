"use client";
import { EMAIL, COUNTRY, INSTAGRAM } from "@/data/site";

/* ============================================================
   FOOTER — global (toutes les pages)
   Marque · pays · Instagram · email · droits réservés
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

        {/* Instagram + Email + droits */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "flex-end" }}>
            <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer"
              aria-label="Instagram" title={`@${INSTAGRAM}`}
              style={{ color: "#8a8983", display: "inline-flex", transition: "color .25s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8983")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href={`mailto:${EMAIL}`}
              style={{ color: GOLD, fontSize: "12.5px", letterSpacing: "0.1em", textDecoration: "none" }}>
              {EMAIL}
            </a>
          </div>
          <p style={{ color: "#5a5955", fontSize: "9.5px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            © 2026 OneArtPix · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
