/* ============================================================
   ONEARTPIX — PAGE /private/<dossier>
   L'accès est déjà garanti par le middleware.
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrivateFolder } from "@/data/private";
import PrivateGrid from "@/components/PrivateGrid";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function PrivateFolderPage({
  params,
}: {
  params: Promise<{ folder: string }>;
}) {
  const { folder } = await params;
  const data = getPrivateFolder(folder);
  if (!data) notFound();

  return <PrivateGrid folder={data} />;
}
