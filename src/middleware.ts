/* ============================================================
   ONEARTPIX — MIDDLEWARE DE PROTECTION
   Vérifie le code du cookie ET la portée du dossier demandé.
   ============================================================ */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCode, canAccess } from "@/lib/access";
import { getPrivateFolder } from "@/data/private";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  /* La porte reste toujours accessible. */
  if (pathname === "/private") return NextResponse.next();

  const cookie = req.cookies.get("oap_private")?.value || "";
  const result = await verifyCode(cookie);

  const back = req.nextUrl.clone();
  back.pathname = "/private";
  back.search = "";

  if (!result.ok) return NextResponse.redirect(back);

  /* Page de génération de codes : toi seul. */
  if (pathname.startsWith("/private/admin")) {
    if (result.scope !== "ALL") return NextResponse.redirect(back);
    return NextResponse.next();
  }

  /* Un dossier précis : la portée doit correspondre. */
  const match = pathname.match(/^\/private\/([^/]+)$/);
  if (match) {
    const folder = getPrivateFolder(match[1]);
    if (!folder || !canAccess(result.scope, folder.scope)) {
      return NextResponse.redirect(back);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/private/:path*", "/private-photos/:path*"],
};
