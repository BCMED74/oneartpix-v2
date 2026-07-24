/* ============================================================
   PAGE DE TEST — à supprimer une fois le flux validé
   ============================================================ */

import AccessRequest from "@/components/AccessRequest";

export const metadata = {
  title: "Test",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", padding: "120px 5vw" }}>
      <AccessRequest scope="VILLA" title="Sélection villa" />
    </main>
  );
}
