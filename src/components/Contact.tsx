"use client";
import { useState } from "react";

/* === CONTACT SECTION === */
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", artwork: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    /* === Send to Formspree or custom API === */
    await fetch("https://formspree.io/f/info@oneartpix.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="py-32 px-8"
      style={{ background: "#0a0a0a", borderTop: "1px solid rgba(201,169,110,0.1)" }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <p
          className="mb-6 tracking-widest uppercase"
          style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.4em" }}
        >
          Get in Touch
        </p>
        <h2
          className="font-display mb-6"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, color: "#fff" }}
        >
          Interested in a{" "}
          <em style={{ color: "#C9A96E" }}>Print?</em>
        </h2>
        <p style={{ color: "#888", marginBottom: "48px", lineHeight: 1.8 }}>
          Each edition is unique. Tell me which image speaks to you —<br />
          I will get back to you personally.
        </p>

        {sent ? (
          <div style={{ color: "#C9A96E", fontSize: "14px", letterSpacing: "0.2em", padding: "40px 0" }}>
            ✦ Message received. I will be in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {[
              { key: "name", label: "Your Name", type: "text" },
              { key: "email", label: "Your Email", type: "email" },
              { key: "artwork", label: "Artwork of Interest", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <input
                  type={type}
                  placeholder={label}
                  required
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-transparent py-4 px-0 text-white placeholder-gray-600 focus:outline-none"
                  style={{
                    borderBottom: "1px solid rgba(201,169,110,0.2)",
                    fontSize: "14px",
                    letterSpacing: "0.05em",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#C9A96E")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(201,169,110,0.2)")}
                />
              </div>
            ))}
            <textarea
              placeholder="Your message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-transparent py-4 px-0 text-white placeholder-gray-600 focus:outline-none resize-none"
              style={{
                borderBottom: "1px solid rgba(201,169,110,0.2)",
                fontSize: "14px",
                letterSpacing: "0.05em",
              }}
              onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#C9A96E")}
              onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(201,169,110,0.2)")}
            />
            <div className="pt-8">
              <button
                type="submit"
                disabled={sending}
                className="w-full py-5 transition-all duration-500"
                style={{
                  background: "transparent",
                  border: "1px solid #C9A96E",
                  color: "#C9A96E",
                  fontSize: "11px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  cursor: "pointer",
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
            </div>
          </form>
        )}

        {/* Footer */}
        <div
          className="mt-20 pt-8 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.2em" }}>
            © 2026 OneArtPix · info@oneartpix.com
          </p>
        </div>
      </div>
    </section>
  );
}
