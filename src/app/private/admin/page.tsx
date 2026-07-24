/* ============================================================
   ONEARTPIX — GÉNÉRATEUR DE CODES  (/private/admin)
   Accès réservé au passe-partout (contrôlé par le middleware).
   ============================================================ */

import type { Metadata } from "next";
import { allScopes } from "@/data/private";
import AdminCodes from "@/components/AdminCodes";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminCodes scopes={allScopes()} />;
}
