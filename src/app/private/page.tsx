/* ============================================================
   ONEARTPIX — PAGE /private
   Cookie valide → index filtré selon la portée du code
   Sinon        → écran de saisie
   ============================================================ */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { privateFolders } from "@/data/private";
import { verifyCode, canAccess } from "@/lib/access";
import PrivateGate from "@/components/PrivateGate";
import PrivateIndex from "@/components/PrivateIndex";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function PrivatePage() {
  const jar = await cookies();
  const cookie = jar.get("oap_private")?.value || "";
  const result = await verifyCode(cookie);

  if (!result.ok) return <PrivateGate />;

  const visible = privateFolders.filter((f) => canAccess(result.scope, f.scope));
  return <PrivateIndex folders={visible} isMaster={result.scope === "ALL"} />;
}
