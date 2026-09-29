"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { clearSession, readSession, writeSession, type PersistedSession } from "@/lib/session/session-storage";
import type { AppRole, AuthUser } from "@/types/portal";

interface AuthContextValue {
  status: "loading" | "anonymous" | "authenticated";
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeRole(value: unknown): AppRole {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "student") return "participant";
  if (normalized === "participant" || normalized === "judge" || normalized === "organizer" || normalized === "admin") return normalized;
  throw new Error("The backend returned an unsupported user role.");
}

function normalizeUser(value: unknown): AuthUser {
  if (!value || typeof value !== "object") throw new Error("The backend did not return a valid user profile.");
  const raw = value as Record<string, unknown>;
  const email = String(raw.email ?? "");
  const name = String(raw.name ?? raw.full_name ?? email ?? "").trim();
  const id = String(raw.id ?? "");
  if (!id || !email) throw new Error("The backend user profile is missing an ID or email.");
  return { id, name: name || email, email, role: normalizeRole(raw.role) };
}

interface LoginResponse {
  access_token?: string;
  token_type?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const saved = readSession();
    if (!saved) {
      void Promise.resolve().then(() => { if (!cancelled) setStatus("anonymous"); });
      return () => { cancelled = true; };
    }
    apiRequest<unknown>(endpoints.auth.me, { token: saved.accessToken })
      .then((profile) => {
        if (cancelled) return;
        const resolvedUser = normalizeUser(profile);
        const session: PersistedSession = { accessToken: saved.accessToken, user: resolvedUser };
        writeSession(session);
        setToken(session.accessToken);
        setUser(resolvedUser);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        setToken(null);
        setUser(null);
        setStatus("anonymous");
      });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<LoginResponse>(endpoints.auth.login, {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });
    if (!response?.access_token) throw new Error("Login response did not contain an access token.");
    if (response.token_type && response.token_type.toLowerCase() !== "bearer") throw new Error("The backend returned an unsupported token type.");
    const resolvedUser = normalizeUser(await apiRequest<unknown>(endpoints.auth.me, { token: response.access_token }));
    const session = { accessToken: response.access_token, user: resolvedUser };
    writeSession(session);
    setToken(session.accessToken);
    setUser(resolvedUser);
    setStatus("authenticated");
    return resolvedUser;
  }, []);

  const logout = useCallback(async () => {
    const activeToken = token;
    try {
      if (activeToken) await apiRequest<void>(endpoints.auth.logout, { method: "POST", token: activeToken });
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
      setStatus("anonymous");
    }
  }, [token]);

  const value = useMemo(() => ({ status, user, token, login, logout }), [status, user, token, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider.");
  return value;
}
