import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ============================================================
   API CONTACT — /api/contact
   Envoie les demandes (Contact + Inquire) par email via le SMTP
   Infomaniak, depuis info@oneartpix.com (authentifié => SPF/DKIM OK).
   ------------------------------------------------------------
   ⚠️ Le mot de passe n'est JAMAIS dans le code : il est lu depuis
   les variables d'environnement (à définir dans Infomaniak) :
     SMTP_USER = info@oneartpix.com
     SMTP_PASS = <mot de passe de la boîte info@>
   (optionnel) SMTP_HOST, SMTP_PORT
   ============================================================ */

export const runtime = "nodejs";        // nodemailer a besoin du runtime Node
export const dynamic = "force-dynamic";  // route serveur, pas de cache

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const user = process.env.SMTP_USER || "info@oneartpix.com";
    const pass = process.env.SMTP_PASS;

    // Si le SMTP n'est pas configuré, on renvoie une erreur => le
    // formulaire bascule sur son repli "email direct" (mailto).
    if (!pass) {
      return NextResponse.json({ ok: false, error: "SMTP not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "mail.infomaniak.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: true, // 465 = SSL
      auth: { user, pass },
    });

    /* Met les champs importants en tête, puis tout le reste */
    const order = ["artwork", "tier", "edition", "version", "price", "name", "email", "phone", "message"];
    const keys = [...new Set([...order.filter((k) => k in data), ...Object.keys(data)])];
    const body = keys.map((k) => `${k.toUpperCase()} : ${data[k] ?? ""}`).join("\n");

    await transporter.sendMail({
      from: `"OneArtPix — Website" <${user}>`,
      to: user,                              // info@oneartpix.com
      replyTo: data.email || undefined,      // répondre = répondre au client
      subject: `New inquiry — ${data.artwork || data.name || "OneArtPix"}`,
      text: body,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
