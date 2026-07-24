/* ============================================================
   ONEARTPIX — PAGE PUBLIQUE  /reserve
   Vitrine des collections sur invitation.
   Indexée : c'est une page de marque, pas un contenu privé.
   ============================================================ */

import type { Metadata } from "next";
import { themeFolders } from "@/data/private";
import ReserveThemes from "@/components/ReserveThemes";

export const metadata: Metadata = {
  title: "The Reserve · OneArtPix",
  description:
    "Collections privées OneArtPix, accessibles sur invitation. Séries confidentielles de photographie fine art en édition limitée.",
};

export default function ReservePage() {
  const themes = themeFolders().map((f) => ({
    slug: f.slug,
    title: f.title,
    subtitle: f.subtitle,
    scope: f.scope,
  }));

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", color: "#F4F2ED", padding: "120px 5vw 140px" }}>

      {/* === EN-TÊTE === */}
      <header style={{ maxWidth: "760px", marginBottom: "88px" }}>
        <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 18px" }}>
          Sur invitation
        </p>
        <h1 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, letterSpacing: "-0.01em", margin: "0 0 28px", lineHeight: 1.05 }}>
          The Reserve
        </h1>
        <p style={{ color: "#9a9892", fontSize: "17px", lineHeight: 1.8, margin: 0 }}>
          Certaines séries ne rejoignent pas la collection publique. Elles restent en réserve,
          montrées uniquement à qui les demande. Choisissez un territoire : un accès temporaire
          de quinze jours vous sera transmis.
        </p>
      </header>

      {/* === THÉMATIQUES === */}
      <ReserveThemes themes={themes} />

    </main>
  );
}
