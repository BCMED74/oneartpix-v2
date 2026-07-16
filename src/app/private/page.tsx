/* ============================================================
   ONEARTPIX — PAGE /private
   Si le cookie est valide → index des dossiers
   Sinon → écran de saisie du code
   ============================================================ */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { privateFolders } from "@/data/private";
import PrivateGate from "@/components/PrivateGate";
import PrivateIndex from "@/components/PrivateIndex";

/* === SEO : invisible pour les moteurs === */
export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function PrivatePage() {
  const jar = await cookies();
  const cookie = jar.get("oap_private")?.value;
  const real = Buffer.from(process.env.PRIVATE_CODE_B64 || "", "base64")
    .toString("utf8")
    .trim();

  const authorized = !!real && cookie === real;

  if (!authorized) return <PrivateGate />;
  return <PrivateIndex folders={privateFolders} />;
}
