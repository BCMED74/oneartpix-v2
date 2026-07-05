/* ============================================================
   API — /api/contact  ·  ⚠️ VERSION DEBUG (temporaire)
   Renvoie l'erreur SMTP réelle + vérifie la lecture de l'env.
   À remettre en version normale une fois le souci réglé.
   ============================================================ */

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* === GET (debug) === l'env est-il bien lu ? (ne révèle pas le mot de passe) */
export async function GET() {
  return NextResponse.json({
    smtpUser: process.env.SMTP_USER ?? null,            // l'adresse n'est pas secrète
    smtpUserSet: Boolean(process.env.SMTP_USER),
    smtpPassSet: Boolean(process.env.SMTP_PASS),
    smtpPassLength: process.env.SMTP_PASS?.length ?? 0, // longueur seulement
  });
}

const PRIORITY = ["artwork", "tier", "edition", "version", "price", "name", "email", "phone", "message"];
const LABELS: Record<string, string> = {
  artwork: "Artwork", tier: "Tier", edition: "Edition", version: "Version",
  price: "Price", name: "Name", email: "Email", phone: "Phone", message: "Message",
};

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Record<string, string>;
    const visitorEmail = (data.email || "").trim();
    if (!visitorEmail) return NextResponse.json({ error: "Email requis." }, { status: 400 });

    const keys = [
      ...PRIORITY.filter((k) => data[k]),
      ...Object.keys(data).filter((k) => !PRIORITY.includes(k) && data[k]),
    ];
    const textBody = keys.map((k) => `${LABELS[k] ?? k}: ${data[k]}`).join("\n");

    const transporter = nodemailer.createTransport({
      host: "mail.infomaniak.com",
      port: 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    /* DEBUG : teste la connexion + l'auth AVANT d'envoyer */
    await transporter.verify();

    await transporter.sendMail({
      from: `"OneArtPix" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: `"${data.name || "Visitor"}" <${visitorEmail}>`,
      subject: data.artwork ? `Inquiry — ${data.artwork}` : `Contact — OneArtPix`,
      text: textBody,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    /* DEBUG : renvoie l'erreur réelle (à retirer ensuite) */
    const e = err as { message?: string; code?: string; command?: string; responseCode?: number; response?: string };
    console.error("[/api/contact] échec :", err);
    return NextResponse.json({
      error: "Envoi impossible.",
      debug: {
        message: e?.message ?? String(err),
        code: e?.code ?? null,
        command: e?.command ?? null,
        responseCode: e?.responseCode ?? null,
        response: e?.response ?? null,
      },
    }, { status: 500 });
  }
}
