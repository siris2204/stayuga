"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { OwnerSidebar } from "./OwnerSidebar";

export function OwnerGuard({ children }: { children: ReactNode }) {
  const { token, loading } = useOwnerAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) router.replace("/owner/login");
  }, [loading, token, router]);

  if (loading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-ink-soft">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <OwnerSidebar />
      <div className="flex-1 overflow-x-hidden px-6 py-8 sm:px-10">{children}</div>
    </div>
  );
}
