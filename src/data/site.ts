/* ============================================================
   RÉGLAGES DU SITE — à éditer facilement
   ============================================================ */

export const EMAIL = "info@oneartpix.com";
export const COUNTRY = "Switzerland";

/* === FORMULAIRES (Formspree) ===
   Endpoint connecté à info@oneartpix.com.
   Pour changer : remplace l'ID après /f/ .
   1re vraie soumission → Formspree envoie un mail de confirmation à activer. */
export const FORM_ENDPOINT = "https://formspree.io/f/xkolkbrg";

/* true dès qu'un vrai ID (≠ XXXXXXXX) est présent */
export const FORM_READY = !FORM_ENDPOINT.includes("XXXXXXXX");
