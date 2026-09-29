"use client";

import Link from "next/link";
import { useCallback } from "react";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { MetricCard } from "@/components/ui/MetricCard";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getAssignments, getJudges, getProgress, getResults } from "@/lib/api/portal";
import { getAllProjects, listEventRecords } from "@/lib/api/organizer";

async function settle<T>(promise: Promise<T>): Promise<{ data: T | null; error: string }> {
  try { return { data: await promise, error: "" }; }
  catch (reason) { return { data: null, error: reason instanceof Error ? reason.message : "The API request failed." }; }
}

export function OrganizerOverview() {
  const { token } = useAuth();
  const load = useCallback(async () => {
    if (!token) throw new Error("Your session has expired.");
    const [events, projects, judges, assignments, progress, results] = await Promise.all([
      settle(listEventRecords(token)), settle(getAllProjects(token)), settle(getJudges(token)), settle(getAssignments(token)), settle(getProgress(token)), settle(getResults(token)),
    ]);
    return { events, projects, judges, assignments, progress, results };
  }, [token]);
  const resource = useAsyncResource(load);
  if (resource.status === "loading") return <><FixtureBanner /><PageHeader eyebrow="ORGANIZER / OVERVIEW" title="Event operations" description="Manage the event, submission pipeline, judge workload, and results." /><StatePanel variant="loading" title="Loading event operations" description="Collecting available event and judging summaries." /></>;
  if (resource.status === "error") return <><FixtureBanner /><PageHeader eyebrow="ORGANIZER / OVERVIEW" title="Event operations" /><StatePanel variant="error" title="Organizer workspace unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /></>;

  const value = resource.data;
  const errors = [value.events, value.projects, value.judges, value.assignments, value.progress, value.results].filter((item) => item.error).map((item) => item.error);
  const eventCount = value.events.data?.length ?? 0;
  const projectCount = value.projects.data?.length ?? 0;
  const judgeCount = value.judges.data?.length ?? 0;
  const progress = value.progress.data;
  const assignmentCount = value.assignments.data?.length ?? 0;
  const completion = progress?.totalReviews ? Math.round(progress.completedReviews / progress.totalReviews * 100) : 0;

  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / OVERVIEW" title="Event operations" description="A single view of event setup, project intake, judge coverage, and review completion." actions={<Link className="button button--primary" href="/organizer/events/new">Create event <span aria-hidden="true">→</span></Link>} />
    {errors.length ? <Notice tone="amber" title="Some dashboard modules are unavailable">{[...new Set(errors)].join(" · ")}</Notice> : null}
    <div className="metric-grid metric-grid--four"><MetricCard label="Events" value={value.events.data ? eventCount : "—"} note={value.events.data?.[0]?.name ?? "Event API unavailable"} /><MetricCard label="Projects" value={value.projects.data ? projectCount : "—"} note="All submissions returned to organizer" accent="mint" /><MetricCard label="Judges" value={value.judges.data ? judgeCount : "—"} note="Invited and active" accent="amber" /><MetricCard label="Reviews" value={progress ? `${progress.completedReviews} / ${progress.totalReviews}` : "—"} note={progress ? `${completion}% complete` : "Progress API unavailable"} accent="coral" /></div>
    <div className="content-grid content-grid--two">
      <Panel title="Event overview" description="Current event and registration state." action={<Link className="text-link" href="/organizer/events">Manage events →</Link>}>
        {value.events.data?.length ? value.events.data.slice(0, 3).map((event) => <div className="event-list-row" key={event.id}><div><strong>{event.name}</strong><small>{event.startDate ? new Date(event.startDate).toLocaleDateString() : "Dates not set"} · {event.tracks.length} tracks · {event.prizes.length} prizes</small></div><StatusBadge tone={event.status === "open" ? "mint" : event.status === "closed" ? "coral" : "amber"}>{event.status}</StatusBadge></div>) : <div className="empty-inline">No event record available from the API.</div>}
      </Panel>
      <Panel title="Judging progress" description="Completion from the backend progress endpoint." action={<Link className="text-link" href="/organizer/integrity">View integrity →</Link>}>
        {progress ? <><div className="progress-summary"><strong>{progress.completedReviews}<small> / {progress.totalReviews}</small></strong><span>reviews completed</span></div><ProgressBar value={progress.completedReviews} max={progress.totalReviews} label="Overall review completion" /><div className="mini-stats"><span>Pending <strong>{progress.pendingReviews}</strong></span><span>Assignments <strong>{assignmentCount}</strong></span><span>Projects complete <strong>{progress.completedProjects}</strong></span></div></> : <div className="empty-inline">The backend has not supplied judging progress.</div>}
      </Panel>
    </div>
    <div className="quick-links-grid"><Link className="quick-link-card" href="/organizer/projects"><span>01 / SUBMISSIONS</span><strong>Review projects</strong><small>{projectCount || "—"} available →</small></Link><Link className="quick-link-card" href="/organizer/judges"><span>02 / PEOPLE</span><strong>Manage judges</strong><small>{judgeCount || "—"} records →</small></Link><Link className="quick-link-card" href="/organizer/assignments"><span>03 / WORKLOAD</span><strong>Assign reviews</strong><small>{assignmentCount || "—"} assignments →</small></Link><Link className="quick-link-card" href="/organizer/results"><span>04 / OUTCOMES</span><strong>View results</strong><small>{value.results.data?.length ?? "—"} rows →</small></Link></div>
  </>;
}
