"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { useAuth } from "@/features/auth/AuthProvider";
import { API_BASE_URL, isApiConfigured } from "@/lib/api/config";
import { roleHome } from "@/lib/session/roles";

export function LoginPage() {
  const { status, user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && user) router.replace(roleHome[user.role]);
  }, [status, user, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const signedIn = await login(email, password);
      router.replace(roleHome[signedIn.role]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Login failed. Check your credentials and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="public-page">
      <PublicHeader />
      <main className="login-layout">
        <section className="login-intro">
          <p className="eyebrow">DOGFOOD 2026 · HACKATHON PORTAL</p>
          <h1>One event.<br /><span>Four workspaces.</span></h1>
          <p>Sign in to continue to your student, judge, organizer, or admin workspace. Your role comes from the JudgeForge API.</p>
          <div className="login-footnote"><span className="status-dot status-dot--mint" /> Backend-enforced access · JWT session</div>
          <Link className="text-link" href="/projects">Browse public projects <span aria-hidden="true">↗</span></Link>
        </section>
        <section className="panel login-card" aria-labelledby="login-title">
          <div className="section-kicker">ACCOUNT ACCESS <span>01 / 01</span></div>
          <h2 id="login-title">Sign in</h2>
          <p className="muted">Use your JudgeForge account credentials.</p>
          {!isApiConfigured ? <div className="notice notice--amber"><strong>Backend origin not set.</strong><span>Requests currently use same-origin <code>/api</code>. Set <code>NEXT_PUBLIC_API_BASE_URL</code> to the reachable JudgeForge origin, or route <code>/api</code> to the backend in your local reverse proxy. The cloud Preview does not host the backend.</span></div> : <div className="notice notice--quiet">API origin: <code>{API_BASE_URL}</code></div>}
          {error ? <div className="form-error" role="alert">{error}</div> : null}
          <form className="form-stack" onSubmit={submit}>
            <label className="field"><span>Email</span><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <label className="field"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" /></label>
            <button className="button button--primary button--wide" type="submit" disabled={busy || status === "loading"}>{busy ? "Signing in…" : "Sign in securely"}<span aria-hidden="true">→</span></button>
          </form>
          <p className="registration-switch">New to DOGFOOD? <Link href="/register">Create a participant account</Link></p>
          <div className="login-card__bottom"><span>Token remains in this browser tab only.</span><span>Session verified with <code>/api/auth/me</code></span></div>
        </section>
      </main>
    </div>
  );
}
