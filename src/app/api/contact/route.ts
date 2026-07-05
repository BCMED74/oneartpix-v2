/* ============================================================
   API — /api/contact
   Reçoit le formulaire (JSON) et envoie l'e-mail via le SMTP
   Infomaniak authentifié info@oneartpix.com (SPF/DKIM OK).
   App Router · runtime Node (nodemailer ne tourne pas en Edge).
   ============================================================ */

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* === RUNTIME === Node + rendu dynamique (jamais mis en cache). */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* === CHAMPS PRIORITAIRES === ordre d'affichage en tête de l'e-mail. */
const PRIORITY = ["artwork", "tier", "edition", "version", "price", "name", "email", "phone", "message"];

const LABELS: Record<string, string> = {
  artwork: "Artwork", tier: "Tier", edition: "Edition", version: "Version",
  price: "Price", name: "Name", email: "Email", phone: "Phone", message: "Message",
};

export async function POST(req: Request) {
  try {
    /* === 1. LECTURE DU CORPS (JSON) === */
    const data = (await req.json()) as Record<string, string>;

    const visitorEmail = (data.email || "").trim();
    if (!visitorEmail) {
      return NextResponse.json({ error: "Email requis." }, { status: 400 });
    }

    /* === 2. MISE EN FORME === champs prioritaires présents, puis le reste. */
    const keys = [
      ...PRIORITY.filter((k) => data[k]),
      ...Object.keys(data).filter((k) => !PRIORITY.includes(k) && data[k]),
    ];
    const textBody = keys.map((k) => `${LABELS[k] ?? k}: ${data[k]}`).join("\n");
    const htmlBody = keys
      .map((k) => `<p style="margin:4px 0"><strong>${LABELS[k] ?? k} :</strong> ${escapeHtml(data[k])}</p>`)
      .join("");

    const subject = data.artwork
      ? `Inquiry — ${data.artwork}${data.edition ? ` · ${data.edition}` : ""}`
      : `Contact — OneArtPix`;

    /* === 3. TRANSPORT SMTP INFOMANIAK === identifiants lus dans l'env. */
    const transporter = nodemailer.createTransport({
      host: "mail.infomaniak.com",
      port: 465,
      secure: true, // 465 = SSL direct
      auth: {
        user: process.env.SMTP_USER, // info@oneartpix.com
        pass: process.env.SMTP_PASS, // mot de passe de la boîte info@
      },
    });

    /* === 4. ENVOI === from = adresse authentifiée · replyTo = visiteur. */
    await transporter.sendMail({
      from: `"OneArtPix" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: `"${data.name || "Visitor"}" <${visitorEmail}>`,
      subject,
      text: textBody,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#0E1116">${htmlBody}</div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact] envoi échoué :", err);
    return NextResponse.json({ error: "Envoi impossible." }, { status: 500 });
  }
}

/* === UTILITAIRE === échappe le HTML pour l'e-mail. */
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
