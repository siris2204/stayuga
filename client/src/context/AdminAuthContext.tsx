"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import {
  AdminInfo,
  clearAdminSession,
  getAdminInfo,
  getAdminToken,
  saveAdminSession,
} from "@/lib/adminAuth";

interface AdminAuthContextValue {
  admin: AdminInfo | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAdmin(getAdminInfo());
    setToken(getAdminToken());
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { token, admin } = await apiFetch<{ token: string; admin: AdminInfo }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    saveAdminSession(token, admin);
    setToken(token);
    setAdmin(admin);
  }

  function logout() {
    clearAdminSession();
    setToken(null);
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
