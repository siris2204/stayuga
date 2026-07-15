import { env } from "../config/env";

export function buildWhatsAppLink(message: string): string {
  const number = env.whatsappNumber.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}
