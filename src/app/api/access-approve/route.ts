/* ============================================================
   ONEARTPIX — VALIDATION D'UNE DEMANDE
   Tu cliques le lien du mail → le code part chez le visiteur.
   Le jeton est vérifié : impossible de s'auto-valider.
   ============================================================ */

import { NextResponse } from "next/server";
import { verifyCode, makeCode } from "@/lib/access";
import { getTransport, wrapHtml, FROM_EMAIL } from "@/lib/mailer";

export const runtime = "nodejs";

const SITE = "https://www.oneartpix.com";

/* Page de retour, dans la charte. */
function page(title: string, text: string) {
  const html = [
    '<html><body style="background:#0E1116;margin:0;font-family:Helvetica,Arial,sans-serif">',
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px">',
    '<div style="max-width:420px;text-align:center">',
    '<p style="color:#C9A96E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 24px">OneArtPix</p>',
    '<h1 style="color:#F4F2ED;font-size:26px;font-weight:300;margin:0 0 18px">' + title + "</h1>",
    '<p style="color:#9a9892;font-size:15px;line-height:1.7;margin:0">' + text + "</p>",
    "</div></div></body></html>",
  ].join("");
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t") || "";
  const scope = (url.searchParams.get("s") || "").toUpperCase();
  const email = url.searchParams.get("e") || "";
  const name = url.searchParams.get("n") || "";

  if (!token || !scope || !email) {
    return page("Lien incomplet", "Ce lien de validation n’est pas valide.");
  }

  /* Le jeton doit correspondre exactement à cette portée. */
  const check = await verifyCode(token);
  if (!check.ok || check.scope !== "VALID" + scope) {
    return page("Lien expiré", "Ce lien n’est plus valide. Génère un code manuellement depuis l’espace privé.");
  }

  /* Le vrai code du visiteur : 15 jours. */
  const code = await makeCode(scope, 15);

  const body = [
    "<p>Bonjour " + name + ",</p>",
    "<p>Merci pour votre intérêt. Voici votre accès temporaire à la galerie privée <strong style=\"color:#C9A96E\">" + scope + "</strong>.</p>",
    '<p style="border:1px solid #2a2f38;padding:24px;text-align:center;margin:28px 0"><span style="color:#5a5955;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;display:block;margin-bottom:12px">Votre code</span><span style="color:#C9A96E;font-size:24px;letter-spacing:0.14em">' + code + "</span></p>",
    "<p>Valable 15 jours. Rendez-vous sur <a href=\"" + SITE + "/private\" style=\"color:#C9A96E\">" + SITE.replace("https://", "") + "/private</a> et saisissez ce code.</p>",
    "<p>Chaque tirage est disponible en édition limitée. N’hésitez pas à répondre à ce message pour toute demande.</p>",
  ].join("");

  try {
    const t = getTransport();
    await t.sendMail({
      from: FROM_EMAIL,
      to: email,
      bcc: FROM_EMAIL,
      subject: "Votre accès · OneArtPix",
      html: wrapHtml("Accès à la galerie privée", body),
    });
  } catch {
    return page("Envoi impossible", "Le code n’a pas pu être envoyé. Réessaie ou génère-le manuellement.");
  }

  return page("Accès envoyé", "Le code <strong style=\"color:#C9A96E\">" + code + "</strong> vient d’être envoyé à " + email + ".");
}
