/* ============================================================
   ONEARTPIX — PUBLIC PAGE  /reserve
   Title, barcode gate, nothing else.
   No category is ever revealed.
   ============================================================ */

import type { Metadata } from "next";
import path from "path";
import fs from "fs";
import { themeFolders } from "@/data/private";
import ReserveBarcode from "@/components/ReserveBarcode";

export const metadata: Metadata = {
  title: "The Reserve · OneArtPix",
  description:
    "Private OneArtPix collections, accessible by invitation. Confidential fine art photography series in limited edition.",
};

export default function ReservePage() {
  /* Only covers that actually exist feed the barcode:
     a missing file would leave an empty band in the pattern. */
  const dir = path.join(process.cwd(), "public", "reserve");
  const images = themeFolders()
    .map((f) => f.slug + ".webp")
    .filter((name) => {
      try { return fs.existsSync(path.join(dir, name)); } catch { return false; }
    })
    .map((name) => "/reserve/" + name);

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", color: "#F4F2ED", display: "flex", flexDirection: "column" }}>

      {/* === HEADER === */}
      <header style={{ maxWidth: "720px", margin: "0 auto", padding: "130px 5vw 60px", textAlign: "center" }}>
        <p style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 20px" }}>
          By invitation
        </p>
        <h1 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, letterSpacing: "-0.01em", margin: "0 0 32px", lineHeight: 1.05 }}>
          The Reserve
        </h1>
        <p style={{ color: "#b4b2ac", fontSize: "18px", lineHeight: 1.9, margin: 0 }}>
          Part of the work never joins the public collection.
          <br />
          These series stay in reserve, shown only to those who ask.
        </p>
      </header>

      {/* === BARCODE GATE === */}
      <ReserveBarcode images={images} />

      <div style={{ flex: 1, minHeight: "140px" }} />

    </main>
  );
}
