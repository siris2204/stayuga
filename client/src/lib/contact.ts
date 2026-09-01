import { ContactInfo } from "./types";

/**
 * Fallback shown only until `/api/content`'s "contact-info" block loads (or
 * if the request fails). The real values live in server/.env
 * (WHATSAPP_NUMBER, CONTACT_EMAIL, INSTAGRAM_URL) — nothing here should be
 * treated as authoritative.
 */
export const DEFAULT_CONTACT: ContactInfo = {
  email: "hello@stayuga.com",
  phone: "+91 00000 00000",
  location: "Hyderabad, India",
  instagram: "https://www.instagram.com/",
};

/** Builds a wa.me deep link from a contact-info phone number. */
export function whatsappLink(phone: string, message?: string): string {
  const number = phone.replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return number ? `https://wa.me/${number}${text}` : `https://wa.me/${text}`;
}
