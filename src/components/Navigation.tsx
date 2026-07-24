"use client";
import { useEffect, useState } from "react";

/* ============================================================
   NAVIGATION — logo XXL à cheval · liens /#… (scroll)
   CONTACT ouvre directement le pop-up de contact
   ============================================================ */

const LEFT = [
  { label: "Collection", href: "/collection" },
  { label: "The Twins", href: "/twins" },
  { label: "Transmutations", href: "/transmutations" },
  { label: "The Reserve", href: "/reserve" },
];
const RIGHT = [
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
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
    color: "rgba(244,242,237,0.82)", letterSpacing: "0.16em", fontSize: "12px",
    textTransform: "uppercase", textDecoration: "none",
  };
  const hov = (e: React.MouseEvent<HTMLAnchorElement>, on: boolean) =>
    (e.currentTarget.style.color = on ? GOLD : "rgba(244,242,237,0.78)");

  const openContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") window.dispatchEvent(new Event("openContactModal"));
      else window.location.href = "/?contact=1";
    }
  };

  const renderLink = (item: { label: string; href: string }, key: string) =>
    item.label === "Contact" ? (
      <a key={key} href={item.href} style={linkStyle} onClick={openContact}
        onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)}>
        {item.label}
      </a>
    ) : (
      <a key={key} href={item.href} style={linkStyle} onClick={() => setOpen(false)}
        onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)}>
        {item.label}
      </a>
    );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        overflow: "visible",
        background: scrolled
          ? "rgba(14,17,22,0.92)"
          : "linear-gradient(to bottom, rgba(14,17,22,0.66) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div
          className="px-6 md:px-12"
          style={{
            position: "relative",
            display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
            width: "100%", maxWidth: "1536px", gap: "16px",
            paddingTop: "9px", paddingBottom: "9px", minHeight: "44px",
          }}
        >
          <div className="hidden md:flex" style={{ gap: "24px", justifyContent: "flex-start" }}>
            {LEFT.map((item) => renderLink(item, item.label))}
          </div>

          <span aria-hidden style={{ display: "block", width: "1px" }} />

          <div className="hidden md:flex" style={{ gap: "24px", justifyContent: "flex-end" }}>
            {RIGHT.map((item) => renderLink(item, item.label))}
          </div>

          <button className="md:hidden flex flex-col" aria-label="Menu" onClick={() => setOpen((o) => !o)}
            style={{ justifySelf: "end", gridColumn: "3", gap: "5px", background: "none", border: "none", cursor: "pointer", padding: "6px" }}>
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", transition: "transform .3s", transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", opacity: open ? 0 : 1, transition: "opacity .2s" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#F4F2ED", transition: "transform .3s", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </button>

          <a href="/" onClick={() => setOpen(false)} aria-label="OneArtPix — home"
            style={{ position: "absolute", left: "50%", top: "6px", transform: "translateX(-50%)", display: "block", lineHeight: 0 }}>
            <img src="/oneartpix-logo-gold.png" alt="OneArtPix"
              style={{ height: "clamp(70px, 7.5vw, 108px)", width: "auto", display: "block" }} />
          </a>
        </div>
      </div>

      <div className="md:hidden"
        style={{ overflow: "hidden", maxHeight: open ? "320px" : "0px",
          transition: "max-height .45s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(14,17,22,0.98)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}>
        <div className="flex flex-col px-6 py-2">
          {ALL.map((item, i) => (
            item.label === "Contact" ? (
              <a key={item.label + i} href={item.href} onClick={openContact} className="uppercase"
                style={{ color: "rgba(244,242,237,0.85)", letterSpacing: "0.22em", fontSize: "12px", textDecoration: "none",
                  padding: "16px 0", borderBottom: i < ALL.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                {item.label}
              </a>
            ) : (
              <a key={item.label + i} href={item.href} onClick={() => setOpen(false)} className="uppercase"
                style={{ color: "rgba(244,242,237,0.85)", letterSpacing: "0.22em", fontSize: "12px", textDecoration: "none",
                  padding: "16px 0", borderBottom: i < ALL.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                {item.label}
              </a>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}
