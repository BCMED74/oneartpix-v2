"use client";
import { useState, useEffect } from "react";

/* ============================================================
   CONTACT — grande bande "Contact the Artist" → formulaire en POP-UP
   ============================================================ */

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const INK = "#0E1116";

export default function Contact() {
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", artwork: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenModal(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [openModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("https://formspree.io/f/info@oneartpix.com", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
    } catch { /* silencieux */ }
    setSending(false);
    setSent(true);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 0, padding: "14px 16px", color: WHITE, fontSize: "14px", outline: "none",
    transition: "border-color 0.3s, background 0.3s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "9px", color: "#6b6a65", fontSize: "9.5px",
    letterSpacing: "0.28em", textTransform: "uppercase",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(201,169,110,0.6)";
    e.currentTarget.style.background = "rgba(201,169,110,0.03)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
  };

  return (
    <>
      {/* ===== BANDE ===== */}
      <section
        id="contact"
        style={{
          background: INK, borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(80px, 12vh, 150px) 24px", textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >
        <p style={{ color: GOLD, fontSize: "10.5px", letterSpacing: "0.34em", textTransform: "uppercase", marginBottom: "22px" }}>
          Get in Touch
        </p>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300, color: WHITE, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "26px", maxWidth: "16ch" }}>
          Every edition begins with a conversation.
        </h2>
        <p style={{ color: "#9a9892", fontSize: "15px", lineHeight: 1.8, maxWidth: "46ch", marginBottom: "44px" }}>
          Tell me which image speaks to you — I answer each request personally.
        </p>

        <button
          onClick={() => { setSent(false); setOpenModal(true); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "14px",
            background: "transparent", border: `1px solid ${GOLD}`, color: WHITE,
            fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500,
            padding: "20px 46px", cursor: "pointer", transition: "all .35s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = INK; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = WHITE; }}
        >
          Contact the Artist <span>→</span>
        </button>

        <p style={{ color: "#5a5955", fontSize: "10.5px", letterSpacing: "0.18em", marginTop: "clamp(60px, 10vh, 110px)" }}>
          © 2026 OneArtPix · info@oneartpix.com
        </p>
      </section>

      {/* ===== POP-UP ===== */}
      {openModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpenModal(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", background: "rgba(6,8,11,0.72)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              position: "relative", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto",
              background: "#12161c", border: "1px solid rgba(201,169,110,0.25)", padding: "clamp(28px, 5vw, 52px)",
            }}
          >
            <button onClick={() => setOpenModal(false)} aria-label="Close"
              style={{ position: "absolute", top: "18px", right: "20px", background: "none", border: "none",
                color: "#9a9892", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>×</button>

            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ color: GOLD, fontSize: "15px", letterSpacing: "0.14em", lineHeight: 1.7 }}>
                  ✦ Message received.<br />I will be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Contact the Artist
                </p>
                <h3 style={{ color: WHITE, fontWeight: 300, fontSize: "1.7rem", letterSpacing: "-0.01em", marginBottom: "28px" }}>
                  Interested in a Print?
                </h3>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={labelStyle}>Your Name</label>
                      <input type="text" required placeholder="Jane Doe" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label style={labelStyle}>Your Email</label>
                      <input type="email" required placeholder="jane@example.com" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Artwork of Interest</label>
                    <input type="text" placeholder="e.g. The Guardians · Edition 2/5" value={form.artwork}
                      onChange={(e) => setForm({ ...form, artwork: e.target.value })} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div style={{ marginBottom: "26px" }}>
                    <label style={labelStyle}>Your Message</label>
                    <textarea rows={4} placeholder="Tell me about your project..." value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ ...fieldStyle, resize: "none" }} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <button type="submit" disabled={sending}
                    style={{ width: "100%", padding: "17px", background: WHITE, border: `1px solid ${WHITE}`, color: INK,
                      fontSize: "10.5px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", transition: "all .3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = GOLD; (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = WHITE; (e.currentTarget as HTMLElement).style.borderColor = WHITE; }}>
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
