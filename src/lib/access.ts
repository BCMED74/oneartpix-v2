/* ============================================================
   ONEARTPIX — CODES D'ACCÈS SIGNÉS
   Un code porte en lui sa portée et son expiration, scellées
   par une signature. Aucun rebuild pour créer un code.
   Format : PORTEE-EXPIRATION-SIGNATURE   ex. SNOW-FVJ-K7M2QP
   ============================================================ */

/* Alphabet sans I ni O : pas de confusion à l'oral. */
const ALPHABET = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/* === LECTURE DU SECRET === */
function readSecret(): string {
  const b64 = process.env.PRIVATE_SECRET_B64 || "";
  if (!b64) return "";
  try { return atob(b64).trim(); } catch { return ""; }
}

/* === LECTURE DU PASSE-PARTOUT (toi) === */
export function readMasterCode(): string {
  const b64 = process.env.PRIVATE_CODE_B64 || "";
  if (!b64) return "";
  try { return atob(b64).trim(); } catch { return ""; }
}

/* === JOUR COURANT === */
export function todayIndex(): number {
  return Math.floor(Date.now() / 86400000);
}

/* === SIGNATURE (6 caractères) === */
async function sign(payload: string): Promise<string> {
  const secret = readSecret();
  if (!secret) return "";
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < 6; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/* === GÉNÉRER UN CODE === */
export async function makeCode(scope: string, days: number): Promise<string> {
  const s = scope.trim().toUpperCase();
  const exp = (todayIndex() + days).toString(36).toUpperCase();
  const sig = await sign(s + "|" + exp);
  return s + "-" + exp + "-" + sig;
}

/* === VÉRIFIER UN CODE === */
export async function verifyCode(input: string): Promise<{ ok: boolean; scope: string }> {
  const code = (input || "").trim().toUpperCase();
  if (!code) return { ok: false, scope: "" };

  /* Le passe-partout ouvre tout, sans expiration. */
  const master = readMasterCode();
  if (master && code === master.toUpperCase()) {
    return { ok: true, scope: "ALL" };
  }

  const parts = code.split("-");
  if (parts.length !== 3) return { ok: false, scope: "" };

  const scope = parts[0];
  const exp = parts[1];
  const sig = parts[2];
  const expected = await sign(scope + "|" + exp);
  if (!expected || expected !== sig) return { ok: false, scope: "" };

  const expDay = parseInt(exp, 36);
  if (!Number.isFinite(expDay) || expDay < todayIndex()) {
    return { ok: false, scope: "" };
  }

  return { ok: true, scope };
}

/* === DROIT D'ACCÈS === */
export function canAccess(userScope: string, folderScope: string): boolean {
  if (!userScope) return false;
  if (userScope === "ALL") return true;
  return userScope === folderScope.toUpperCase();
}
