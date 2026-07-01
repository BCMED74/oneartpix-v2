"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* === NAVIGATION - Transparent, sticky, gold === */
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
      style={{
        background: scrolled
          ? "rgba(10, 10, 10, 0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.1)" : "none",
      }}
    >
      <div className="flex items-center justify-between px-8 py-6 max-w-screen-2xl mx-auto">
        {/* === LOGO === */}
        <Link href="/">
          <span
            className="font-display text-xl tracking-widest"
            style={{ color: "#C9A96E", letterSpacing: "0.3em" }}
          >
            OneArtPix
          </span>
        </Link>

        {/* === MENU === */}
        <div className="flex gap-10">
          {["Collection", "The Twins", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.2em",
                fontSize: "11px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#C9A96E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
              }
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
