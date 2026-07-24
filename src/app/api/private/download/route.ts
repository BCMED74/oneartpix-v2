/* ============================================================
   ONEARTPIX — TÉLÉCHARGEMENT D'UNE GALERIE
   Renvoie une archive ZIP des fichiers HD demandés.
   L'accès est revérifié ici : le middleware ne suffit pas
   pour une route qui lit des fichiers sur disque.
   ============================================================ */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";
import { verifyCode, canAccess } from "@/lib/access";
import { getPrivateFolder } from "@/data/private";
import { makeZip, type ZipEntry } from "@/lib/zip";

export const runtime = "nodejs";

export async function POST(req: Request) {
  /* --- 1. Autorisation --- */
  const jar = await cookies();
  const auth = await verifyCode(jar.get("oap_private")?.value || "");
  if (!auth.ok) return NextResponse.json({ ok: false }, { status: 401 });

  /* --- 2. Lecture de la demande --- */
  let slug = "";
  let names: string[] = [];
  try {
    const b = await req.json();
    slug = String(b?.slug || "").trim();
    names = Array.isArray(b?.names) ? b.names.map(String) : [];
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const folder = getPrivateFolder(slug);
  if (!folder || !folder.downloadable) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  if (!canAccess(auth.scope, folder.scope)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  /* --- 3. Liste des fichiers : tout, ou la sélection --- */
  const all = folder.photos.map((p) => p.src.split("/").pop() || "");
  const wanted = names.length > 0 ? all.filter((n) => names.includes(n)) : all;
  if (wanted.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  /* --- 4. Lecture des fichiers HD --- */
  const dir = path.join(process.cwd(), "public", "private-photos", folder.slug, "hd");
  const entries: ZipEntry[] = [];

  for (const n of wanted) {
    /* Sécurité : on ne garde que le nom de base, jamais un chemin. */
    const base = path.basename(n).replace(/\.webp$/i, ".jpg");
    try {
      const data = await fs.readFile(path.join(dir, base));
      entries.push({ name: folder.slug + "/" + base, data });
    } catch {
      /* fichier HD absent : on l'ignore silencieusement */
    }
  }

  if (entries.length === 0) {
    return NextResponse.json({ ok: false, reason: "no_hd" }, { status: 404 });
  }

  /* --- 5. Archive --- */
  const zip = makeZip(entries);
  const filename = folder.slug + ".zip";

  return new NextResponse(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="' + filename + '"',
      "Content-Length": String(zip.length),
    },
  });
}
