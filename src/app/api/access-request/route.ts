/* ============================================================
   ONEARTPIX — DEMANDE D'ACCÈS
   Le visiteur envoie sa demande → tu reçois un mail
   contenant un lien de validation signé.
   Rien n'est ouvert tant que tu n'as pas cliqué.
   ============================================================ */

import { NextResponse } from "next/server";
import { makeCode } from "@/lib/access";
import { getTransport, wrapHtml, FROM_EMAIL } from "@/lib/mailer";

export const runtime = "nodejs";

/* Base du site, pour construire le lien de validation. */
const SITE = "https://www.oneartpix.com";

export async function POST(req: Request) {
  let name = "";
  let email = "";
  let scope = "";
  let message = "";

  try {
    const b = await req.json();
    name = String(b?.name || "").trim().slice(0, 80);
    email = String(b?.email || "").trim().slice(0, 120);
    scope = String(b?.scope || "").trim().toUpperCase().slice(0, 40);
    message = String(b?.message || "").trim().slice(0, 800);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  /* Contrôles simples. */
  if (!name || !email || !scope) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (email.indexOf("@") < 1) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  /* Le jeton de validation : signé, donc infalsifiable.
     Il encode la portée + une validité de 7 jours pour TOI
     (le temps de répondre), pas pour le visiteur. */
  const token = await makeCode("VALID" + scope, 7);
  const link =
    SITE +
    "/api/access-approve?t=" +
    encodeURIComponent(token) +
    "&s=" +
    encodeURIComponent(scope) +
    "&e=" +
    encodeURIComponent(email) +
    "&n=" +
    encodeURIComponent(name);

  const body = [
    "<p><strong style=\"color:#F4F2ED\">" + name + "</strong><br/>" + email + "</p>",
    "<p>Galerie demandée : <strong style=\"color:#C9A96E\">" + scope + "</strong></p>",
    message ? "<p style=\"border-left:2px solid #2a2f38;padding-left:16px\">" + message + "</p>" : "",
    '<p style="margin-top:32px"><a href="' + link + '" style="display:inline-block;border:1px solid #C9A96E;color:#F4F2ED;text-decoration:none;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;padding:14px 30px">Valider 15 jours</a></p>',
    '<p style="font-size:12px;color:#5a5955">Ignore ce message pour refuser la demande.</p>',
  ].join("");

  try {
    const t = getTransport();
    await t.sendMail({
      from: FROM_EMAIL,
      to: FROM_EMAIL,
      replyTo: email,
      subject: "Demande d'accès · " + scope + " · " + name,
      html: wrapHtml("Nouvelle demande d'accès", body),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
