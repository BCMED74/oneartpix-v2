/* === ABOUT SECTION === */
export default function About() {
  return (
    <section
      id="about"
      className="py-32 px-8"
      style={{ background: "#0d0d0d", borderTop: "1px solid rgba(201,169,110,0.1)" }}
    >
      <div className="max-w-screen-2xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <img
            src="https://oneartpix.com/wp-content/uploads/2026/04/DSC04290_TOPAZ_ED_V3_TIFF_PRINT-BARYTA-WEBP.webp"
            alt="OneArtPix — Fine Art Photography"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.3) 0%, transparent 60%)" }}
          />
        </div>

        {/* Text */}
        <div>
          <p
            className="mb-6 tracking-widest uppercase"
            style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.4em" }}
          >
            About
          </p>
          <h2
            className="font-display mb-8"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, color: "#fff", lineHeight: 1.2 }}
          >
            Photographer, artist,
            <br />
            <em style={{ color: "#C9A96E" }}>difficult to categorize.</em>
          </h2>
          <p style={{ color: "#888", lineHeight: 1.9, marginBottom: "24px" }}>
            Sharks, glaciers, skin, rust, ice crystals, lions — sometimes in the same week.
            Based in Switzerland.
          </p>
          <p style={{ color: "#888", lineHeight: 1.9, marginBottom: "40px" }}>
            OneArtPix. The work speaks, not the name.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            {[
              ["5 + 2 AP", "Per edition"],
              ["Made to order", "10 business days"],
              ["Signed", "& numbered"],
            ].map(([value, label]) => (
              <div key={value}>
                <p
                  className="font-display mb-1"
                  style={{ color: "#C9A96E", fontSize: "1.2rem", fontWeight: 300 }}
                >
                  {value}
                </p>
                <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.1em" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
