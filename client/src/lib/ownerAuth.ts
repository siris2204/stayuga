const TOKEN_KEY = "stayuga_owner_token";
const OWNER_KEY = "stayuga_owner_info";

export interface OwnerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export function saveOwnerSession(token: string, owner: OwnerInfo) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(OWNER_KEY, JSON.stringify(owner));
}

export function getOwnerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getOwnerInfo(): OwnerInfo | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(OWNER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearOwnerSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(OWNER_KEY);
}
