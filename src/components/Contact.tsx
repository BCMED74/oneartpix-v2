"use client";
import { useState } from "react";

/* ============================================================
   CONTACT — OneArtPix (registre Porsche)
   Formulaire épuré · titre SANS off-white · CTA plein contraste
   NB: envoi email réel branché dans une passe dédiée
   ============================================================ */

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const INK = "#0E1116";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", artwork: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("https://formspree.io/f/info@oneartpix.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      /* silencieux pour l'instant */
    }
    setSending(false);
    setSent(true);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 0,
    padding: "15px 16px",
    color: WHITE,
    fontSize: "14px",
    letterSpacing: "0.02em",
    outline: "none",
    transition: "border-color 0.3s, background 0.3s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "10px",
    color: "#6b6a65",
    fontSize: "9.5px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(201,169,110,0.6)";
    e.currentTarget.style.background = "rgba(201,169,110,0.03)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-6"
      style={{ background: INK, borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-xl mx-auto">
        {/* === EN-TÊTE === */}
        <div className="text-center">
          <p className="mb-5 uppercase" style={{ color: GOLD, fontSize: "10.5px", letterSpacing: "0.34em" }}>
            Get in Touch
          </p>
          <h2 className="mb-5" style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", fontWeight: 300, color: WHITE, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Interested in a Print?
          </h2>
          <p style={{ color: "#9a9892", marginBottom: "44px", lineHeight: 1.8, fontSize: "14px" }}>
            Each edition is unique. Tell me which image speaks to you —<br />
            I will get back to you personally.
          </p>
        </div>

        {/* === FORMULAIRE / CONFIRMATION === */}
        {sent ? (
          <div style={{ color: GOLD, fontSize: "14px", letterSpacing: "0.18em", padding: "48px 0", textAlign: "center", border: "1px solid rgba(201,169,110,0.25)" }}>
            ✦ Message received. I will be in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label style={labelStyle}>Your Name</label>
                <input type="text" required placeholder="Jane Doe" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle}>Your Email</label>
                <input type="email" required placeholder="jane@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div className="mb-5">
              <label style={labelStyle}>Artwork of Interest</label>
              <input type="text" placeholder="e.g. The Guardians · Edition 2/5" value={form.artwork}
                onChange={(e) => setForm({ ...form, artwork: e.target.value })}
                style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div className="mb-8">
              <label style={labelStyle}>Your Message</label>
              <textarea rows={4} placeholder="Tell me about your project..." value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...fieldStyle, resize: "none" }} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <button
              type="submit" disabled={sending}
              className="w-full py-5 transition-all duration-300"
              style={{
                background: WHITE, border: `1px solid ${WHITE}`, borderRadius: 0, color: INK,
                fontSize: "10.5px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = GOLD; (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = WHITE; (e.currentTarget as HTMLElement).style.borderColor = WHITE; }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        {/* === PIED DE PAGE === */}
        <div className="mt-20 pt-8 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "#6b6a65", fontSize: "10.5px", letterSpacing: "0.18em" }}>
            © 2026 OneArtPix · info@oneartpix.com
          </p>
        </div>
      </div>
    </section>
  );
}
