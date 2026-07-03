/* ============================================================
   ABOUT — manta full-size (sans bordure, fond noir) · cadre agrandi
   ============================================================ */

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";

export default function About() {
  return (
    <section
      id="about"
      className="pb-24 md:pb-32 px-6 md:px-12"
      style={{
        background: "#0E1116",
        display: "flex",
        justifyContent: "center",
        paddingTop: "clamp(70px, 11vh, 150px)",
      }}
    >
      <div
        className="grid md:grid-cols-2 gap-14 md:gap-20 items-center"
        style={{ width: "100%", maxWidth: "1536px" }}
      >
        {/* Manta — full size, sans bordure, se fond dans le noir */}
        <div className="relative overflow-hidden"
          style={{ aspectRatio: "16/9", maxHeight: "820px" }}>
          <img
            src="https://oneartpix.com/wp-content/uploads/2026/05/IMG_1838_MANTA-DOUBLE-TBLX_ONEARTPIX-16-9_V3-gigapixel-standard-v2-2x_WEBP.webp"
            alt="OneArtPix — Fine Art Photography"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Texte */}
        <div>
          <p className="mb-6 uppercase" style={{ color: GOLD, fontSize: "10.5px", letterSpacing: "0.34em" }}>
            About
          </p>
          <h2 className="mb-8"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 300, color: WHITE, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
            Photographer, artist,
            <br />
            difficult to categorize.
          </h2>
          <p style={{ color: "#9a9892", lineHeight: 1.9, marginBottom: "22px", fontSize: "15px", maxWidth: "48ch" }}>
            Sharks, glaciers, skin, rust, ice crystals, lions — sometimes in the same week. Based in Switzerland.
          </p>
          <p style={{ color: "#9a9892", lineHeight: 1.9, marginBottom: "44px", fontSize: "15px" }}>
            OneArtPix. The work speaks, not the name.
          </p>

          <div className="grid grid-cols-3 gap-8" style={{ paddingTop: "8px" }}>
            {[
              ["5 + 2 AP", "Per edition"],
              ["Made to order", "10 business days"],
              ["Signed", "& numbered"],
            ].map(([value, label]) => (
              <div key={value}>
                <p className="mb-1" style={{ color: WHITE, fontSize: "1.05rem", fontWeight: 400 }}>{value}</p>
                <p style={{ color: "#6b6a65", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
