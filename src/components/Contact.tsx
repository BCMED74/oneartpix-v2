"use client";
import { useState } from "react";

/* ============================================================
   CONTACT SECTION — OneArtPix
   Formulaire éditorial luxe · responsive · focus doré
   NB: l'envoi email réel sera branché dans une passe dédiée
   (l'appel Formspree ci-dessous est un placeholder pour l'instant)
   ============================================================ */
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", artwork: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  /* === SUBMIT (placeholder — branchement email à venir) === */
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

  /* === STYLE PARTAGÉ DES CHAMPS === */
  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(201,169,110,0.18)",
    borderRadius: 0,
    padding: "14px 16px",
    color: "#fff",
    fontSize: "14px",
    letterSpacing: "0.03em",
    outline: "none",
    transition: "border-color 0.3s, background 0.3s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    color: "rgba(201,169,110,0.7)",
    fontSize: "10px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#C9A96E";
    e.currentTarget.style.background = "rgba(201,169,110,0.04)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(201,169,110,0.18)";
    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-6"
      style={{ background: "#0a0a0a", borderTop: "1px solid rgba(201,169,110,0.1)" }}
    >
      <div className="max-w-xl mx-auto">
        {/* === EN-TÊTE === */}
        <div className="text-center">
          <p className="mb-5 tracking-widest uppercase"
             style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.4em" }}>
            Get in Touch
          </p>
          <h2 className="font-display mb-5"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1 }}>
            Interested in a <em style={{ color: "#C9A96E" }}>Print?</em>
          </h2>
          <p style={{ color: "#888", marginBottom: "40px", lineHeight: 1.8, fontSize: "14px" }}>
            Each edition is unique. Tell me which image speaks to you —<br />
            I will get back to you personally.
          </p>
        </div>

        {/* === FORMULAIRE / CONFIRMATION === */}
        {sent ? (
          <div style={{
            color: "#C9A96E", fontSize: "14px", letterSpacing: "0.2em",
            padding: "48px 0", textAlign: "center",
            border: "1px solid rgba(201,169,110,0.2)",
          }}>
            ✦ Message received. I will be in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left">
            {/* Nom + Email côte à côte (empilés sur mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label style={labelStyle}>Your Name</label>
                <input
                  type="text" required placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Your Email</label>
                <input
                  type="email" required placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </div>

            {/* Œuvre concernée */}
            <div className="mb-5">
              <label style={labelStyle}>Artwork of Interest</label>
              <input
                type="text" placeholder="e.g. The Guardians · Edition 2/5"
                value={form.artwork}
                onChange={(e) => setForm({ ...form, artwork: e.target.value })}
                style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* Message */}
            <div className="mb-8">
              <label style={labelStyle}>Your Message</label>
              <textarea
                rows={4} placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...fieldStyle, resize: "none" }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* Bouton */}
            <button
              type="submit" disabled={sending}
              className="w-full py-5 transition-all duration-500"
              style={{
                background: "transparent", border: "1px solid #C9A96E",
                borderRadius: 0, color: "#C9A96E",
                fontSize: "11px", letterSpacing: "0.4em",
                textTransform: "uppercase", cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#C9A96E";
                (e.currentTarget as HTMLElement).style.color = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#C9A96E";
              }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        {/* === PIED DE PAGE === */}
        <div className="mt-20 pt-8 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.2em" }}>
            © 2026 OneArtPix · info@oneartpix.com
          </p>
        </div>
      </div>
    </section>
  );
}
