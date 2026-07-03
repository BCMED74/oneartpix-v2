"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ============================================================
   NAVIGATION — logo CENTRÉ (façon Porsche)
   Desktop : liens à gauche · LOGO au centre · liens à droite
   Mobile  : LOGO centré · hamburger à droite
   Fond slate opaque au scroll · voile permanent en haut
   Logo gold ; pour le blanc : /oneartpix-logo-white.png
   ============================================================ */

const LEFT = [
  { label: "Collection", href: "#collection" },
  { label: "The Twins", href: "#collection" },
];
const RIGHT = [
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
const ALL = [...LEFT, ...RIGHT];
const GOLD = "#C9A96E";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle: React.CSSProperties = {
    color: "rgba(244,242,237,0.78)", letterSpacing: "0.22em", fontSize: "10.5px", textTransform: "uppercase",
  };
  const hov = (e: React.MouseEvent<HTMLAnchorElement>, on: boolean) =>
    (e.currentTarget.style.color = on ? GOLD : "rgba(244,242,237,0.78)");

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(14,17,22,0.95)"
          : "linear-gradient(to bottom, rgba(14,17,22,0.62) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div
          className="px-6 md:px-12 py-4 md:py-5"
          style={{
            display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
            width: "100%", maxWidth: "1536px", gap: "16px",
          }}
        >
          {/* GAUCHE — liens (desktop) */}
          <div className="hidden md:flex" style={{ gap: "34px", justifyContent: "flex-start" }}>
            {LEFT.map((item) => (
              <Link key={item.label} href={item.href} style={linkStyle}
                onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* CENTRE — logo */}
          <Link href="/" onClick={() => setOpen(false)} aria-label="OneArtPix — home"
            style={{ justifySelf: "center", display: "block" }}>
            <img src="/oneartpix-logo-gold.png" alt="OneArtPix"
              style={{ height: "42px", width: "auto", display: "block" }} />
          </Link>

          {/* DROITE — liens (desktop) */}
          <div className="hidden md:flex" style={{ gap: "34px", justifyContent: "flex-end" }}>
            {RIGHT.map((item) => (
              <Link key={item.label} href={item.href} style={linkStyle}
                onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* DROITE — hamburger (mobile) */}
          <button
            className="md:hidden flex flex-col"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            style={{ justifySelf: "end", gap: "5px", background: "none", border: "none", cursor: "pointer", padding: "6px" }}
          >
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", transition: "transform .3s", transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", opacity: open ? 0 : 1, transition: "opacity .2s" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", transition: "transform .3s", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </div>

      {/* PANNEAU MOBILE */}
      <div
        className="md:hidden"
        style={{
          overflow: "hidden", maxHeight: open ? "320px" : "0px",
          transition: "max-height .45s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(14,17,22,0.98)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="flex flex-col px-6 py-2">
          {ALL.map((item, i) => (
            <Link key={item.label + i} href={item.href} onClick={() => setOpen(false)} className="uppercase"
              style={{ color: "rgba(244,242,237,0.85)", letterSpacing: "0.22em", fontSize: "12px",
                padding: "16px 0", borderBottom: i < ALL.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
