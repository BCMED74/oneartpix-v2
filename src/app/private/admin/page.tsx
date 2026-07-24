/* ============================================================
   ONEARTPIX — GÉNÉRATEUR DE CODES  (/private/admin)
   Accès réservé au passe-partout (contrôlé par le middleware).
   ============================================================ */

import type { Metadata } from "next";
import { privateFolders } from "@/data/private";
import AdminCodes from "@/components/AdminCodes";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  /* On n'envoie au client que le strict nécessaire. */
  const list = privateFolders.map((f) => ({
    slug: f.slug,
    title: f.title,
    scope: f.scope,
    family: f.family,
  }));

  return <AdminCodes folders={list} />;
}
