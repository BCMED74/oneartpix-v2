/* ============================================================
   ONEARTPIX — PAGE PUBLIQUE  /reserve
   Aucune catégorie visible : un code-barres d'extraits,
   puis une demande d'accès unique qui ouvre l'ensemble.
   ============================================================ */

import type { Metadata } from "next";
import { themeFolders } from "@/data/private";
import ReserveBarcode from "@/components/ReserveBarcode";
import AccessRequest from "@/components/AccessRequest";

export const metadata: Metadata = {
  title: "The Reserve · OneArtPix",
  description:
    "Collections privées OneArtPix, accessibles sur invitation. Séries confidentielles de photographie fine art en édition limitée.",
};

export default function ReservePage() {
  /* Les couvertures servent de matière au code-barres.
     Aucun titre, aucun lien : rien ne révèle la structure. */
  const images = themeFolders().map(
    (f) => "/reserve/" + f.slug + ".webp"
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", color: "#F4F2ED" }}>

      {/* === EN-TÊTE === */}
      <header style={{ maxWidth: "760px", padding: "120px 5vw 72px" }}>
        <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 18px" }}>
          Sur invitation
        </p>
        <h1 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, letterSpacing: "-0.01em", margin: "0 0 28px", lineHeight: 1.05 }}>
          The Reserve
        </h1>
        <p style={{ color: "#9a9892", fontSize: "17px", lineHeight: 1.8, margin: 0 }}>
          Une part du travail ne rejoint jamais la collection publique. Ces séries
          restent en réserve, montrées à qui les demande. Laissez vos coordonnées :
          un accès temporaire de quinze jours vous sera transmis.
        </p>
      </header>

      {/* === CODE-BARRES === */}
      <ReserveBarcode images={images} />

      {/* === DEMANDE D'ACCÈS === */}
      <section style={{ padding: "88px 5vw 140px" }}>
        <AccessRequest scope="RESERVE" title="Demander un accès" />

        <p style={{ color: "#6b6a65", fontSize: "12px", marginTop: "40px" }}>
          Vous avez déjà un code ? <a href="/private" style={{ color: "#C9A96E", textDecoration: "none" }}>Entrer</a>
        </p>
      </section>

    </main>
  );
}
