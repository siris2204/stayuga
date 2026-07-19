import type { Metadata } from "next";
import { OwnerAuthProvider } from "@/context/OwnerAuthContext";

export const metadata: Metadata = {
  title: "Owner Portal",
  robots: { index: false, follow: false },
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <OwnerAuthProvider>{children}</OwnerAuthProvider>;
}
