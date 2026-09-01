"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { DEFAULT_CONTACT, whatsappLink } from "@/lib/contact";
import { ContactInfo, ContentBlocks } from "@/lib/types";

export function WhatsAppButton() {
  const pathname = usePathname();
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);

  const hidden = pathname?.startsWith("/admin") || pathname?.startsWith("/owner");

  useEffect(() => {
    if (hidden) return;
    apiFetch<{ blocks: ContentBlocks }>("/api/content")
      .then((data) => {
        if (data.blocks["contact-info"]) setContact(data.blocks["contact-info"]);
      })
      .catch(() => {});
  }, [hidden]);

  if (hidden) return null;

  const href = whatsappLink(
    contact.phone,
    "Hi Stayuga, I'd like to know more about your properties."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  );
}
