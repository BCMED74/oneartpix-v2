/* ============================================================
   API — /api/contact  ·  ⚠️ VERSION DEBUG (temporaire)
   Mot de passe SMTP stocké en Base64 (SMTP_PASS_B64) pour éviter
   tout souci de caractère spécial dans le fichier .env.
   ============================================================ */

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* === Décode le mot de passe Base64 (repli sur SMTP_PASS en clair si besoin) === */
function smtpPass(): string {
  const b64 = process.env.SMTP_PASS_B64;
  if (b64) return Buffer.from(b64, "base64").toString("utf8");
  return process.env.SMTP_PASS ?? "";
}

/* === GET (debug) === contrôle sans révéler le mot de passe === */
export async function GET() {
  const pass = smtpPass();
  return NextResponse.json({
    smtpUser: process.env.SMTP_USER ?? null,
    smtpUserSet: Boolean(process.env.SMTP_USER),
    passDecodedLength: pass.length,          // doit correspondre à la longueur réelle de ton mot de passe
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
      auth: { user: process.env.SMTP_USER, pass: smtpPass() },
    });

    await transporter.verify(); // DEBUG : teste l'auth avant l'envoi

    await transporter.sendMail({
      from: `"OneArtPix" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: `"${data.name || "Visitor"}" <${visitorEmail}>`,
      subject: data.artwork ? `Inquiry — ${data.artwork}` : `Contact — OneArtPix`,
      text: textBody,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const e = err as { message?: string; code?: string; responseCode?: number; response?: string };
    console.error("[/api/contact] échec :", err);
    return NextResponse.json({
      error: "Envoi impossible.",
      debug: { message: e?.message ?? String(err), code: e?.code ?? null, responseCode: e?.responseCode ?? null, response: e?.response ?? null },
    }, { status: 500 });
  }
}
