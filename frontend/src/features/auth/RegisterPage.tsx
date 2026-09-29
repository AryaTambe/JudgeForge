"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { API_BASE_URL, isApiConfigured } from "@/lib/api/config";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await apiRequest<unknown>(endpoints.auth.register, {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      setCreated(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Registration failed. Check the backend contract and try again.");
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
          <h1>Join the event.<br /><span>Build your workspace.</span></h1>
          <p>Create a participant account to prepare a team and project submission. Judge, Organizer, and Admin roles are assigned by the event backend; registration cannot choose or grant a privileged role.</p>
          <div className="login-footnote"><span className="status-dot status-dot--mint" /> Participant registration · backend verified</div>
          <Link className="text-link" href="/login">Already have an account? Sign in <span aria-hidden="true">→</span></Link>
        </section>
        <section className="panel login-card" aria-labelledby="register-title">
          <div className="section-kicker">CREATE ACCOUNT <span>01 / 01</span></div>
          {created ? (
            <div className="registration-success" role="status" aria-live="polite">
              <h2 id="register-title">Registration accepted</h2>
              <p className="muted">The backend accepted your registration request. Sign in with the account you created; your role will be resolved by <code>/api/auth/me</code>.</p>
              <Link className="button button--primary button--wide" href="/login">Continue to sign in <span aria-hidden="true">→</span></Link>
            </div>
          ) : (
            <>
              <h2 id="register-title">Create a participant account</h2>
              <p className="muted">New accounts are registered as participants. Your role is assigned by JudgeForge, not selected here.</p>
              {!isApiConfigured ? <div className="notice notice--amber"><strong>Backend origin not set.</strong><span>Requests currently use same-origin <code>/api</code>. Set <code>NEXT_PUBLIC_API_BASE_URL</code> to the reachable JudgeForge origin, or route <code>/api</code> to the backend in your local reverse proxy. The cloud Preview does not host the backend.</span></div> : <div className="notice notice--quiet">API origin: <code>{API_BASE_URL}</code></div>}
              <div className="notice notice--amber registration-contract"><strong>Registration route is an assumption.</strong><span>This form calls <code>POST /api/auth/register</code> with <code>{"{ name, email, password }"}</code>. The supplied backend walkthrough did not document registration; confirm the endpoint and payload in the current OpenAPI spec.</span></div>
              {error ? <div className="form-error" role="alert">{error}</div> : null}
              <form className="form-stack" onSubmit={submit}>
                <label className="field"><span>Full name</span><input autoComplete="name" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
                <label className="field"><span>Email</span><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                <label className="field"><span>Password</span><input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></label>
                <label className="field"><span>Confirm password</span><input type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Enter your password again" /></label>
                <button className="button button--primary button--wide" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create participant account"}<span aria-hidden="true">→</span></button>
              </form>
              <div className="login-card__bottom"><span>No demo identity is created.</span><span>Sign-in still requires a valid backend session.</span></div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
