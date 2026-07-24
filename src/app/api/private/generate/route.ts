/* ============================================================
   ONEARTPIX — GÉNÉRATION DE CODES
   Réservé au passe-partout : on revérifie le cookie ici,
   jamais uniquement côté client.
   ============================================================ */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCode, makeCode } from "@/lib/access";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const jar = await cookies();
  const result = await verifyCode(jar.get("oap_private")?.value || "");
  if (!result.ok || result.scope !== "ALL") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let target = "";
  let days = 15;
  try {
    const body = await req.json();
    target = String(body?.scope || "").trim();
    days = Math.min(365, Math.max(1, Number(body?.days) || 15));
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!target) return NextResponse.json({ ok: false }, { status: 400 });

  const code = await makeCode(target, days);
  return NextResponse.json({ ok: true, code });
}
