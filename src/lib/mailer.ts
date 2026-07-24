/* ============================================================
   ONEARTPIX — ENVOI DE MAILS
   Transport unique réutilisé par les routes API.
   Identifiants : .env.local (SMTP_USER / SMTP_PASS_B64)
   ============================================================ */

import nodemailer from "nodemailer";

export const FROM_EMAIL = process.env.SMTP_USER || "info@oneartpix.com";

/* === TRANSPORT INFOMANIAK === */
export function getTransport() {
  const pass = Buffer.from(process.env.SMTP_PASS_B64 || "", "base64")
    .toString("utf8")
    .trim();

  return nodemailer.createTransport({
    host: "mail.infomaniak.com",
    port: 465,
    secure: true,
    auth: { user: FROM_EMAIL, pass: pass },
  });
}

/* === GABARIT HTML (charte OneArtPix) === */
export function wrapHtml(title: string, body: string): string {
  return [
    '<div style="background:#0E1116;padding:48px 24px;font-family:Helvetica,Arial,sans-serif">',
    '<div style="max-width:520px;margin:0 auto">',
    '<p style="color:#C9A96E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 28px">OneArtPix</p>',
    '<h1 style="color:#F4F2ED;font-size:24px;font-weight:300;margin:0 0 28px">' + title + "</h1>",
    '<div style="color:#9a9892;font-size:15px;line-height:1.7">' + body + "</div>",
    '<p style="color:#5a5955;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:44px 0 0;border-top:1px solid #2a2f38;padding-top:24px">OneArtPix · Switzerland</p>',
    "</div></div>",
  ].join("");
}
