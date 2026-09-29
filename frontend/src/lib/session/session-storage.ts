import type { AuthUser } from "@/types/portal";

const SESSION_KEY = "judgeforge.session.v1";

export interface PersistedSession {
  accessToken: string;
  user: AuthUser;
}

export function readSession(): PersistedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedSession>;
    if (typeof parsed.accessToken !== "string" || !parsed.user) return null;
    return parsed as PersistedSession;
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeSession(session: PersistedSession): void {
  if (typeof window !== "undefined") window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(SESSION_KEY);
}
