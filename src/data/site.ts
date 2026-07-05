/* ============================================================
   RÉGLAGES DU SITE — à éditer facilement
   ============================================================ */

export const EMAIL = "info@oneartpix.com";
export const COUNTRY = "Switzerland";
export const INSTAGRAM = "oneartpix.editions"; // handle (sans @)

/* === FORMULAIRES ===
   Les demandes partent par NOTRE serveur (API /api/contact) via le SMTP
   Infomaniak de info@oneartpix.com. Aucun tiers, SPF/DKIM OK.
   Le mot de passe vit dans les variables d'environnement Infomaniak
   (SMTP_USER / SMTP_PASS), jamais dans le code. */
export const FORM_ENDPOINT = "/api/contact";
export const FORM_READY = true;
