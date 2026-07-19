"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { OwnerInfo, clearOwnerSession, getOwnerInfo, getOwnerToken, saveOwnerSession } from "@/lib/ownerAuth";

interface OwnerAuthContextValue {
  owner: OwnerInfo | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
}

const OwnerAuthContext = createContext<OwnerAuthContextValue | undefined>(undefined);

export function OwnerAuthProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner] = useState<OwnerInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOwner(getOwnerInfo());
    setToken(getOwnerToken());
    setLoading(false);
  }, []);

  async function login(identifier: string, password: string) {
    const { token, owner } = await apiFetch<{ token: string; owner: OwnerInfo }>(
      "/api/owner/auth/login",
      { method: "POST", body: JSON.stringify({ identifier, password }) }
    );
    saveOwnerSession(token, owner);
    setToken(token);
    setOwner(owner);
  }

  function logout() {
    clearOwnerSession();
    setToken(null);
    setOwner(null);
  }

  return (
    <OwnerAuthContext.Provider value={{ owner, token, loading, login, logout }}>
      {children}
    </OwnerAuthContext.Provider>
  );
}

export function useOwnerAuth() {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx) throw new Error("useOwnerAuth must be used within OwnerAuthProvider");
  return ctx;
}
