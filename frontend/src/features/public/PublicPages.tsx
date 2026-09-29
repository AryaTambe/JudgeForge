"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DOGFOOD_EVENT, getEvents, getProject, getPublicProjects } from "@/lib/api/portal";
import { isApiConfigured } from "@/lib/api/config";
import type { EventRecord, ProjectRecord } from "@/types/portal";

const prizeText = (amount?: number) => amount ? `$${amount.toLocaleString("en-US")}` : "Details on spec";

export function PublicEventPage() {
  const [event, setEvent] = useState<EventRecord>(DOGFOOD_EVENT);
  const [eventWarning, setEventWarning] = useState(false);
  useEffect(() => {
    if (!isApiConfigured) return;
    let active = true;
    getEvents().then((events) => { if (active && events[0]) setEvent(events[0]); }).catch(() => { if (active) setEventWarning(true); });
    return () => { active = false; };
  }, []);

  return <div className="public-page">
    <PublicHeader />
    <main className="public-content public-content--wide">
      <section className="portal-intro">
        <div className="portal-intro__copy">
          <p className="eyebrow">EVENT OPERATIONS <span>/</span> DF-2026</p>
          <h1>{event.name}<span>Submission &amp; judging portal</span></h1>
          <p>{event.description}</p>
          <div className="form-actions"><Link className="button button--primary" href="/login">Sign in to your workspace <span aria-hidden="true">→</span></Link><Link className="button button--quiet" href="/register">Create participant account</Link><Link className="button button--quiet" href="/projects">Browse public projects</Link></div>
        </div>
        <aside className="event-docket" aria-label="Event summary">
          <div className="event-docket__top"><span>EVENT DOSSIER</span><StatusBadge tone={event.status === "open" ? "mint" : event.status === "closed" ? "coral" : "amber"}>{event.status}</StatusBadge></div>
          <dl><div><dt>DATES</dt><dd>{event.startDate ? new Date(event.startDate).toLocaleDateString("en-GB", { timeZone: "UTC" }) : "TBD"} — {event.endDate ? new Date(event.endDate).toLocaleDateString("en-GB", { timeZone: "UTC" }) : "TBD"}</dd></div><div><dt>SUBMISSION DEADLINE</dt><dd>{event.submissionDeadline ? new Date(event.submissionDeadline).toLocaleString("en-GB", { timeZone: "UTC" }) : "TBD"}</dd></div><div><dt>FORMAT</dt><dd>Online · 72 hours</dd></div><div><dt>PRIZE POOL</dt><dd>$2,500 across five prizes</dd></div></dl>
          <a className="text-link" href="https://dogfoodhack.com/spec/" target="_blank" rel="noreferrer">Open event specification ↗</a>
        </aside>
      </section>
      {eventWarning ? <Notice tone="amber" title="Live event feed unavailable">Showing the official event details included with this frontend. Live track and prize changes require the JudgeForge API.</Notice> : null}
      <section className="public-metrics" aria-label="Event summary"><MetricCard label="Format" value="72 hours" note="One product to build" /><MetricCard label="Dates" value="Sep 26–29" note="2026 · UTC timeline" accent="mint" /><MetricCard label="Entry" value="Free" note="Online hackathon" accent="amber" /><MetricCard label="Prize pool" value="$2,500" note="Across five prizes" accent="coral" /></section>
      <section className="public-section-grid">
        <Panel title="Build the platform" description="The event specification is organized around two delivery tiers."><div className="tier-list"><div className="tier-row"><span className="tier-number">T1</span><div><strong>Core workflows</strong><small>Auth, roles, events, teams, submissions, deadlines, and public discovery.</small></div><StatusBadge tone="blue">Core</StatusBadge></div><div className="tier-row"><span className="tier-number">T2</span><div><strong>Judging operations</strong><small>Assignments, weighted scoring, integrity, progress, results, and export.</small></div><StatusBadge tone="mint">Priority</StatusBadge></div></div><p className="panel-footnote">Correctness over breadth. Backend authorization remains authoritative.</p></Panel>
        <Panel title="Prize summary" description="Prize breakdown from the official DOGFOOD brief."><div className="prize-list">{event.prizes.length ? event.prizes.map((prize) => <div className="prize-row" key={prize.id}><span>{prize.title}</span><strong>{prizeText(prize.amount)}</strong></div>) : <div className="empty-inline">Prize details load from the event API.</div>}</div><a className="text-link" href="https://dogfoodhack.com/spec/" target="_blank" rel="noreferrer">Full event specification ↗</a></Panel>
      </section>
      <section className="role-entry-section"><div className="section-heading"><div><p className="eyebrow">WORKSPACES / 04 ROLES</p><h2>Choose your workspace.</h2></div><p>Sign in with your JudgeForge account. Your role is resolved by the backend.</p></div><div className="public-role-grid">{[{ role: "01", name: "Participant", detail: "Team and project submissions" }, { role: "02", name: "Judge", detail: "Assigned reviews and scoring" }, { role: "03", name: "Organizer", detail: "Events, judges, and results" }, { role: "04", name: "Admin", detail: "Platform-level overview" }].map((item) => <Link className="public-role-card" href="/login" key={item.role}><span>{item.role} / WORKSPACE</span><strong>{item.name}</strong><small>{item.detail}</small><b aria-hidden="true">→</b></Link>)}</div></section>
      <Notice tone="quiet" title="Fixture disclosure">The bundled project gallery uses anonymous <strong>Sample Hack 2026</strong> fixture records. They are not live DOGFOOD submissions.</Notice>
      <footer className="public-footer"><span>DOGFOOD 2026 · HACKATHON RAPTORS</span><span>Self-hostable · Open source · API-first</span></footer>
    </main>
  </div>;
}

export function PublicProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("all");
  const [teamSize, setTeamSize] = useState("all");
  useEffect(() => {
    let active = true;
    getPublicProjects().then((items) => { if (active) { setProjects(items); setState("ready"); } }).catch(() => { if (active) setState("error"); });
    return () => { active = false; };
  }, []);
  const tracks = useMemo(() => [...new Set(projects.map((project) => project.track).filter(Boolean))].sort(), [projects]);
  const filtered = useMemo(() => projects.filter((project) => {
    const needle = query.trim().toLowerCase();
    const matchesText = !needle || [project.title, project.summary, project.team, project.track].some((value) => value.toLowerCase().includes(needle));
    const matchesTrack = track === "all" || project.track === track;
    const matchesTeam = teamSize === "all" || (teamSize === "solo" ? project.teamSize === 1 : teamSize === "small" ? project.teamSize >= 2 && project.teamSize <= 3 : project.teamSize >= 4);
    return matchesText && matchesTrack && matchesTeam;
  }), [projects, query, track, teamSize]);

  return <div className="public-page"><PublicHeader /><main className="public-content public-content--wide">
    <PageHeader eyebrow="PUBLIC DIRECTORY / 01" title="Project gallery" description="Search and filter submitted projects. Open the repository or demo to learn more." actions={<Link href="/" className="button button--quiet">Event overview</Link>} />
    <Notice tone="quiet" title="Sample Hack 2026 fixtures">These anonymous records are the shared sample dataset, not live DOGFOOD submissions.</Notice>
    <section className="gallery-controls" aria-label="Project filters">
      <label className="field field--search"><span>Search projects</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, summary, team…" /></label>
      <label className="field"><span>Track</span><select value={track} onChange={(event) => setTrack(event.target.value)}><option value="all">All tracks</option>{tracks.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label className="field"><span>Team size</span><select value={teamSize} onChange={(event) => setTeamSize(event.target.value)}><option value="all">Any size</option><option value="solo">Solo</option><option value="small">2–3 members</option><option value="large">4+ members</option></select></label>
      <div className="filter-count"><strong>{state === "ready" ? filtered.length : "—"}</strong><span>projects</span></div>
    </section>
    {state === "loading" ? <StatePanel variant="loading" title="Loading projects" description="Fetching the public project list." /> : null}
    {state === "error" ? <StatePanel variant="error" title="The gallery could not load" description="Check the API origin and public gallery access, then retry." actionLabel="Try again" onAction={() => { setState("loading"); getPublicProjects().then((items) => { setProjects(items); setState("ready"); }).catch(() => setState("error")); }} /> : null}
    {state === "ready" && filtered.length === 0 ? <StatePanel variant="no-results" title="No matching projects" description="Try another keyword or remove one of the filters." /> : null}
    {state === "ready" && filtered.length > 0 ? <div className="project-grid">{filtered.map((project, index) => <article className="project-card" key={project.id}>
      <div className="project-card__top"><span className="project-index">{String(index + 1).padStart(2, "0")}</span><StatusBadge tone="blue">{project.track}</StatusBadge></div>
      <Link className="project-card__title" href={`/projects/view?id=${encodeURIComponent(project.id)}`}>{project.title}<span aria-hidden="true">↗</span></Link>
      <p>{project.summary}</p>
      <div className="project-card__meta"><span><small>TEAM</small><strong>{project.team}</strong></span><span><small>SIZE</small><strong>{project.teamSize}</strong></span></div>
      <div className="project-card__links">{project.repositoryUrl ? <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repository ↗</a> : <span>Repository unavailable</span>}{project.demoUrl ? <a href={project.demoUrl} target="_blank" rel="noreferrer">Demo ↗</a> : null}</div>
    </article>)}</div> : null}
    <footer className="public-footer"><span>DOGFOOD 2026 · SAMPLE GALLERY DATA</span><Link href="/">Return to event overview ↑</Link></footer>
  </main></div>;
}

function ProjectDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const displayState = id ? state : "error";
  useEffect(() => {
    if (!id) return;
    let active = true;
    getProject(id, null, true).then((item) => { if (active) { setProject(item); setState("ready"); } }).catch(() => { if (active) setState("error"); });
    return () => { active = false; };
  }, [id]);
  return <div className="public-page"><PublicHeader /><main className="public-content public-content--detail">
    <Link href="/projects" className="back-link">← Back to gallery</Link>
    {displayState === "loading" ? <StatePanel variant="loading" title="Loading project" description="Retrieving the project details." /> : null}
    {displayState === "error" ? <StatePanel variant="error" title="Project not available" description="The project ID is missing, unknown, or the API could not return it." /> : null}
    {displayState === "ready" && project ? <article className="detail-sheet">
      <div className="detail-sheet__meta"><StatusBadge tone="blue">{project.track}</StatusBadge><span>Sample Hack 2026 · Fixture project</span></div>
      <h1>{project.title}</h1><p className="detail-summary">{project.summary}</p>
      <div className="detail-facts"><div><small>TEAM</small><strong>{project.team}</strong></div><div><small>TEAM SIZE</small><strong>{project.teamSize} members</strong></div><div><small>STATUS</small><strong>Fixture submission</strong></div></div>
      {project.description ? <section className="detail-description"><h2>About this project</h2><p>{project.description}</p></section> : null}
      <div className="detail-links">{project.repositoryUrl ? <a className="button button--primary" href={project.repositoryUrl} target="_blank" rel="noreferrer">Open repository ↗</a> : null}{project.demoUrl ? <a className="button button--quiet" href={project.demoUrl} target="_blank" rel="noreferrer">Open demo ↗</a> : null}</div>
      <Notice tone="quiet" title="Fixture project">This anonymous record is part of the shared Sample Hack 2026 dataset, not a live DOGFOOD submission.</Notice>
    </article> : null}
  </main></div>;
}

export function PublicProjectDetailPage() {
  return <Suspense fallback={<div className="public-page"><PublicHeader /><main className="public-content"><StatePanel variant="loading" title="Loading project" description="Reading the project link." /></main></div>}><ProjectDetailContent /></Suspense>;
}
