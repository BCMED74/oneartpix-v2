/* ============================================================
   ONEARTPIX — MIDDLEWARE DE PROTECTION
   Bloque tout /private/* ET les fichiers images /private-photos/*
   tant que le cookie "oap_private" n'est pas valide.
   ============================================================ */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* === LECTURE DU CODE (base64 → texte) === */
/* Le code vit dans .env.local sous PRIVATE_CODE_B64.
   Encodé en base64 pour éviter les problèmes de parsing dotenv. */

function readCode(): string {
  const b64 = process.env.PRIVATE_CODE_B64 || "";
  if (!b64) return "";
  try {
    return atob(b64).trim();
  } catch {
    return "";
  }
}

/* === LOGIQUE === */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // La page de saisie du code doit rester accessible.
  if (pathname === "/private") return NextResponse.next();

  const code = readCode();
  const cookie = req.cookies.get("oap_private")?.value;
  const authorized = code !== "" && cookie === code;

  if (authorized) return NextResponse.next();

  // Non autorisé → retour à la porte.
  const url = req.nextUrl.clone();
  url.pathname = "/private";
  url.search = "";
  return NextResponse.redirect(url);
}

/* === PORTÉE === */
/* Ne s'exécute QUE sur ces chemins. Le reste du site est intact. */

export const config = {
  matcher: ["/private/:path*", "/private-photos/:path*"],
};
