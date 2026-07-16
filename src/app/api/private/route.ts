/* ============================================================
   ONEARTPIX — API GALERIE PRIVÉE
   POST   → vérifie le code, pose le cookie (12 h)
   DELETE → déconnexion, efface le cookie
   ============================================================ */

import { NextResponse } from "next/server";

/* === LECTURE DU CODE === */

function readCode(): string {
  const b64 = process.env.PRIVATE_CODE_B64 || "";
  if (!b64) return "";
  try {
    return Buffer.from(b64, "base64").toString("utf8").trim();
  } catch {
    return "";
  }
}

/* === POST : CONNEXION === */

export async function POST(req: Request) {
  const real = readCode();
  if (!real) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 500 });
  }

  let submitted = "";
  try {
    const body = await req.json();
    submitted = String(body?.code || "").trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (submitted !== real) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("oap_private", real, {
    httpOnly: true,   // invisible pour le JavaScript du navigateur
    secure: true,     // HTTPS uniquement
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 heures
  });
  return res;
}

/* === DELETE : DÉCONNEXION === */

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("oap_private", "", { path: "/", maxAge: 0 });
  return res;
}
