/* ============================================================
   ONEARTPIX — API GALERIE PRIVÉE
   POST   → vérifie le code, pose le cookie
   DELETE → déconnexion
   ============================================================ */

import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/access";

export const runtime = "nodejs";

/* === POST : CONNEXION === */

export async function POST(req: Request) {
  let submitted = "";
  try {
    const body = await req.json();
    submitted = String(body?.code || "").trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const result = await verifyCode(submitted);
  if (!result.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  /* Le cookie stocke le code : le middleware le revérifie
     à chaque requête, donc rien à falsifier. */
  const res = NextResponse.json({ ok: true, scope: result.scope });
  res.cookies.set("oap_private", submitted.toUpperCase(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

/* === DELETE : DÉCONNEXION === */

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("oap_private", "", { path: "/", maxAge: 0 });
  return res;
}
