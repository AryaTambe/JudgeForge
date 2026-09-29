"use client";

import Link from "next/link";
import { useCallback, useState, type FormEvent } from "react";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { assignJudges, getAssignments, getJudges, inviteJudge } from "@/lib/api/portal";
import { getAllProjects, getAllTeams, listEventRecords } from "@/lib/api/organizer";
import { formatSubmittedAt } from "@/lib/utils/format-date";
import type { AssignmentRecord, JudgeRecord, ProjectRecord, TeamRecord } from "@/types/portal";

const tone = (status: string): "mint" | "amber" | "coral" | "blue" | "neutral" => status === "open" || status === "Active" || status === "submitted" || status === "completed" ? "mint" : status === "closed" ? "coral" : status === "pending" || status === "Invited" || status === "draft" ? "amber" : "neutral";

export function OrganizerEventsPage() {
  const { token } = useAuth();
  const load = useCallback(() => token ? listEventRecords(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / EVENTS" title="Events" description="Create and configure dates, tracks, and prizes for each event." actions={<Link className="button button--primary" href="/organizer/events/new">Create event →</Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading events" description="Retrieving the organizer event list." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Events unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" && resource.data.length === 0 ? <StatePanel variant="empty" title="No events yet" description="Create an event before teams can submit projects or judges can be assigned."><Link className="button button--primary" href="/organizer/events/new">Create event</Link></StatePanel> : null}
    {resource.status === "ready" && resource.data.length > 0 ? <Panel title="Event directory" description={`${resource.data.length} event record${resource.data.length === 1 ? "" : "s"} returned by the API.`}><div className="event-directory">{resource.data.map((event) => <article className="event-directory__row" key={event.id}><div className="event-directory__mark">{event.name.slice(0, 1)}</div><div className="event-directory__main"><div><strong>{event.name}</strong><small>{event.description}</small></div><div className="event-directory__facts"><span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : "Start TBD"} – {event.endDate ? new Date(event.endDate).toLocaleDateString() : "End TBD"}</span><span>{event.tracks.length} tracks</span><span>{event.prizes.length} prizes</span></div></div><StatusBadge tone={tone(event.status)}>{event.status}</StatusBadge><Link className="button button--quiet" href={`/organizer/events/edit?id=${encodeURIComponent(event.id)}`}>Configure →</Link></article>)}</div></Panel> : null}
  </>;
}

export function OrganizerProjectsPage() {
  const { token } = useAuth();
  const load = useCallback(() => token ? getAllProjects(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / SUBMISSIONS" title="Projects" description="Review project metadata returned by the organizer's project endpoint." />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading projects" description="Retrieving event submissions." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Project list unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" && resource.data.length === 0 ? <StatePanel variant="empty" title="No submissions" description="Submitted projects will appear here." /> : null}
    {resource.status === "ready" && resource.data.length > 0 ? <Panel title={`${resource.data.length} projects`} description="Repository and demo links open in a separate tab."><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Project</th><th>Team</th><th>Track</th><th>Submitted</th><th>Status</th><th>Links</th></tr></thead><tbody>{resource.data.map((project) => <tr key={project.id}><td><strong>{project.title}</strong><small>{project.summary}</small></td><td>{project.team}</td><td>{project.track}</td><td>{project.submittedAt ? formatSubmittedAt(project.submittedAt) : "—"}</td><td><StatusBadge tone={tone(project.status)}>{project.status}</StatusBadge></td><td className="table-links">{project.repositoryUrl ? <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repo ↗</a> : null}{project.demoUrl ? <a href={project.demoUrl} target="_blank" rel="noreferrer">Demo ↗</a> : null}</td></tr>)}</tbody></table></div></Panel> : null}
  </>;
}

export function OrganizerTeamsPage() {
  const { token } = useAuth();
  const load = useCallback(() => token ? getAllTeams(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  const teams: TeamRecord[] = resource.status === "ready" ? resource.data : [];
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / TEAMS" title="Teams" description="Team membership is managed by the backend. The team directory needs a collection endpoint." />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading teams" description="Retrieving the organizer team directory." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Team directory endpoint not confirmed" description={resource.error} /> : null}
    {resource.status === "ready" && teams.length === 0 ? <StatePanel variant="empty" title="No teams returned" description="The backend returned an empty team directory." /> : null}
    {resource.status === "ready" && teams.length > 0 ? <Panel title={`${teams.length} teams`} description="Member details come from the authorized team collection response."><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Team</th><th>Members</th><th>Event</th><th>Status</th></tr></thead><tbody>{teams.map((team) => <tr key={team.id}><td><strong>{team.name}</strong><small>{team.id}</small></td><td>{team.members.map((member) => member.name).join(", ") || "—"}</td><td>{team.eventId ?? "—"}</td><td><StatusBadge tone={tone(team.status)}>{team.status}</StatusBadge></td></tr>)}</tbody></table></div></Panel> : null}
    <Notice tone="quiet" title="Backend contract gap">The provided OpenAPI/demo contract confirms team creation, “my team”, team detail, invites, and join. It does not confirm a role-authorized collection route for organizers to list all teams.</Notice>
  </>;
}

export function OrganizerJudgesPage() {
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    if (!token) throw new Error("Your session has expired.");
    const [judges, events] = await Promise.all([getJudges(token), listEventRecords(token)]);
    return { judges, events };
  }, [token]);
  const resource = useAsyncResource(load);
  async function sendInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { if (!token) throw new Error("Your session has expired."); await inviteJudge(token, email.trim(), eventId || undefined); setMessage(`Invitation request sent for ${email.trim()}.`); setEmail(""); resource.reload(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not invite this judge."); }
    finally { setBusy(false); }
  }
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / PEOPLE" title="Judge management" description="Invite judges, review their status, then assign project evaluations." />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading judges" description="Retrieving judge and event records." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Judge list unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" ? <div className="content-grid content-grid--two">
      <Panel title="Invite a judge" description="The backend issues the invitation and enforces its validity.">
        {message ? <Notice tone="mint" title="Invitation requested">{message}</Notice> : null}{error ? <div className="form-error" role="alert">{error}</div> : null}
        <form className="form-stack" onSubmit={sendInvite}><label className="field"><span>Judge email</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="judge@example.com" /></label><label className="field"><span>Event</span><select value={eventId} onChange={(event) => setEventId(event.target.value)}><option value="">Use backend default</option>{resource.data.events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</select></label><button className="button button--primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send judge invitation →"}</button></form>
      </Panel>
      <Panel title="Judge directory" description={`${resource.data.judges.length} judge record${resource.data.judges.length === 1 ? "" : "s"} returned by the API.`}>
        {resource.data.judges.length ? <div className="compact-list">{resource.data.judges.map((judge) => <div className="compact-row" key={judge.id}><span className="avatar">{judge.name.slice(0, 1).toUpperCase()}</span><div><strong>{judge.name}</strong><small>{judge.email} · {judge.completedCount}/{judge.assignedCount} completed</small></div><StatusBadge tone={tone(judge.status)}>{judge.status}</StatusBadge></div>)}</div> : <div className="empty-inline">No judge records returned yet.</div>}
      </Panel>
    </div> : null}
  </>;
}

interface AssignmentLoad { projects: ProjectRecord[]; judges: JudgeRecord[]; assignments: AssignmentRecord[] }
export function OrganizerAssignmentsPage() {
  const { token } = useAuth();
  const [judgeId, setJudgeId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async (): Promise<AssignmentLoad> => {
    if (!token) throw new Error("Your session has expired.");
    const [projects, judges, assignments] = await Promise.all([getAllProjects(token), getJudges(token), getAssignments(token)]);
    return { projects, judges, assignments };
  }, [token]);
  const resource = useAsyncResource(load);
  async function submitAssignments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      if (!token || !judgeId || !selected.length) throw new Error("Choose a judge and at least one project.");
      const result = await assignJudges(token, { judge_id: judgeId, project_ids: selected });
      setMessage(`Assignment request completed. ${JSON.stringify(result)}`); setSelected([]); resource.reload();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create assignments."); }
    finally { setBusy(false); }
  }
  function toggleProject(id: string) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / JUDGING" title="Assignments" description="Connect judges to projects. Assignment visibility is enforced by the API, not by these controls." />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading assignment data" description="Retrieving projects, judges, and assignment records." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Assignment tools unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" ? <>
      {message ? <Notice tone="mint" title="Assignments updated">{message}</Notice> : null}{error ? <div className="form-error" role="alert">{error}</div> : null}
      <div className="content-grid content-grid--two">
        <Panel title="Assign projects" description="Select one judge and one or more projects. The backend validates eligibility and duplicate assignments.">
          <form className="form-stack" onSubmit={submitAssignments}><label className="field"><span>Judge</span><select required value={judgeId} onChange={(event) => setJudgeId(event.target.value)}><option value="">Choose judge</option>{resource.data.judges.map((judge) => <option key={judge.id} value={judge.id}>{judge.name} — {judge.status}</option>)}</select></label><fieldset className="project-picker"><legend>Projects <small>{selected.length} selected</small></legend>{resource.data.projects.map((project) => <label className="project-pick" key={project.id}><input type="checkbox" checked={selected.includes(project.id)} onChange={() => toggleProject(project.id)} /><span><strong>{project.title}</strong><small>{project.team} · {project.track}</small></span></label>)}</fieldset><button className="button button--primary" type="submit" disabled={busy || !resource.data.projects.length || !resource.data.judges.length}>{busy ? "Assigning…" : "Assign selected projects →"}</button></form>
        </Panel>
        <Panel title="Current assignments" description="Records returned by the backend's judge assignment endpoint.">
          {resource.data.assignments.length ? <div className="compact-list">{resource.data.assignments.map((assignment) => <div className="compact-row" key={assignment.id}><div><strong>{assignment.project.title}</strong><small>{assignment.project.team} · {assignment.project.track}</small></div><StatusBadge tone={tone(assignment.status)}>{assignment.status.replaceAll("_", " ")}</StatusBadge><span className="muted">{assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : "No due date"}</span></div>)}</div> : <div className="empty-inline">No assignment records have been returned.</div>}
        </Panel>
      </div>
    </> : null}
  </>;
}
