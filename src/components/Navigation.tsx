"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ============================================================
   NAVIGATION — logo signature · fixe · lisible sur toute image
   • Voile permanent en haut (lisibilité sur photos claires)
   • Fond slate opaque au scroll
   • Menu desktop + menu mobile (hamburger)
   • Pour passer le logo en gold : /oneartpix-logo-gold.png
   ============================================================ */

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "The Twins", href: "#collection" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const GOLD = "#C9A96E";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(14,17,22,0.95)"
          : "linear-gradient(to bottom, rgba(14,17,22,0.6) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-4 md:py-5 max-w-screen-2xl mx-auto">
        {/* === LOGO === */}
        <Link href="/" onClick={() => setOpen(false)} aria-label="OneArtPix — home">
          <img
            src="/oneartpix-logo-white.png"
            alt="OneArtPix"
            style={{ height: "38px", width: "auto", display: "block" }}
          />
        </Link>

        {/* === MENU DESKTOP === */}
        <div className="hidden md:flex" style={{ gap: "38px" }}>
          {LINKS.map((item, i) => (
            <Link
              key={item.label + i}
              href={item.href}
              className="uppercase transition-colors duration-300"
              style={{ color: "rgba(244,242,237,0.72)", letterSpacing: "0.22em", fontSize: "10.5px" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244,242,237,0.72)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* === BOUTON MOBILE === */}
        <button
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", transition: "transform .3s", transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", opacity: open ? 0 : 1, transition: "opacity .2s" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", transition: "transform .3s", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
        </button>
      </div>

      {/* === PANNEAU MOBILE === */}
      <div
        className="md:hidden"
        style={{
          overflow: "hidden",
          maxHeight: open ? "320px" : "0px",
          transition: "max-height .45s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(14,17,22,0.98)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="flex flex-col px-6 py-2">
          {LINKS.map((item, i) => (
            <Link
              key={item.label + i}
              href={item.href}
              onClick={() => setOpen(false)}
              className="uppercase"
              style={{
                color: "rgba(244,242,237,0.8)", letterSpacing: "0.22em", fontSize: "12px",
                padding: "16px 0", borderBottom: i < LINKS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
