const TOKEN_KEY = "stayuga_admin_token";
const ADMIN_KEY = "stayuga_admin_info";

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
}

export function saveAdminSession(token: string, admin: AdminInfo) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminInfo(): AdminInfo | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}
