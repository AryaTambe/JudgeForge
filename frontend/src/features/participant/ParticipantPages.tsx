"use client";

import Link from "next/link";
import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { MetricCard } from "@/components/ui/MetricCard";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { createTeam, getEvents, getMyProjects, getMyTeam } from "@/lib/api/portal";
import { createTeamInvite } from "@/lib/api/team";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { formatSubmittedAt } from "@/lib/utils/format-date";
import type { ProjectRecord, TeamRecord } from "@/types/portal";

const statusTone = (status: string): "mint" | "amber" | "coral" | "blue" | "neutral" => {
  if (status === "submitted" || status === "completed" || status === "Active") return "mint";
  if (status === "draft" || status === "pending" || status === "Invited") return "amber";
  if (status === "closed") return "coral";
  return "neutral";
};

export function ParticipantDashboard() {
  const { token } = useAuth();
  const load = useCallback(async () => {
    if (!token) throw new Error("Your session has expired. Sign in again.");
    const [team, projects] = await Promise.all([getMyTeam(token), getMyProjects(token)]);
    return { team, projects };
  }, [token]);
  const resource = useAsyncResource(load);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="STUDENT / OVERVIEW" title="Your event workspace" description="Keep your team and project submission moving." actions={<Link className="button button--primary" href="/participant/projects/new">Create project <span aria-hidden="true">→</span></Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading your workspace" description="Checking your team and submissions." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Workspace data unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" ? <>
      <div className="metric-grid metric-grid--three"><MetricCard label="Team" value={resource.data.team?.name ?? "Not created"} note={resource.data.team ? `${resource.data.team.members.length} members` : "Create or join a team"} accent="blue" /><MetricCard label="Projects" value={resource.data.projects.length} note="Your event submissions" accent="mint" /><MetricCard label="Submission state" value={resource.data.projects.some((item) => item.status === "submitted") ? "Submitted" : "In progress"} note="Deadline enforcement is handled by JudgeForge" accent="amber" /></div>
      <div className="content-grid content-grid--two">
        <Panel title="Team" description="Your current team membership and invite status." action={<Link className="text-link" href="/participant/team">Open team →</Link>}>
          {resource.data.team ? <div className="team-summary"><span className="team-mark">{resource.data.team.name.slice(0, 1).toUpperCase()}</span><div><strong>{resource.data.team.name}</strong><span>{resource.data.team.members.map((member) => member.name).join(" · ") || "Members load from the API"}</span></div><StatusBadge tone="mint">{resource.data.team.status}</StatusBadge></div> : <div className="empty-inline">You are not on a team yet. Create a team or join with an invitation link.</div>}
          <div className="panel-actions"><Link className="button button--quiet" href="/participant/team/create">Create team</Link><Link className="button button--quiet" href="/participant/team/join">Join team</Link></div>
        </Panel>
        <Panel title="Submission checklist" description="The core participant flow at a glance.">
          <div className="checklist"><div className="checklist-row"><span className="checklist-marker">01</span><span>Join or create a team</span><StatusBadge tone={resource.data.team ? "mint" : "amber"}>{resource.data.team ? "Done" : "Next"}</StatusBadge></div><div className="checklist-row"><span className="checklist-marker">02</span><span>Create a project draft</span><StatusBadge tone={resource.data.projects.length ? "mint" : "amber"}>{resource.data.projects.length ? "Started" : "Next"}</StatusBadge></div><div className="checklist-row"><span className="checklist-marker">03</span><span>Review details and submit</span><StatusBadge tone="neutral">When ready</StatusBadge></div></div>
          <Notice tone="quiet" title="Deadline status">The backend is authoritative for whether a draft can still be edited or submitted.</Notice>
        </Panel>
      </div>
      <Panel title="Recent projects" description="Drafts and submitted work attached to your account." action={<Link className="text-link" href="/participant/projects">All projects →</Link>}>
        {resource.data.projects.length ? <div className="compact-list">{resource.data.projects.slice(0, 4).map((project) => <div className="compact-row" key={project.id}><div><strong>{project.title}</strong><small>{project.track} · {project.team}</small></div><StatusBadge tone={statusTone(project.status)}>{project.status}</StatusBadge><Link className="row-link" href={`/participant/projects/edit?id=${encodeURIComponent(project.id)}`}>Open →</Link></div>)}</div> : <div className="empty-inline">No projects yet. Start a draft when your team is ready.</div>}
      </Panel>
    </> : null}
  </>;
}

export function ParticipantTeamPage() {
  const { token } = useAuth();
  const [invite, setInvite] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const load = useCallback(() => token ? getMyTeam(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  async function generateInvite(team: TeamRecord) {
    if (!token) return;
    setInviteBusy(true); setInviteError("");
    try { setInvite(await createTeamInvite(token, team.id)); }
    catch (error) { setInviteError(error instanceof Error ? error.message : "Could not create an invite."); }
    finally { setInviteBusy(false); }
  }
  async function copyInvite() {
    try { await navigator.clipboard.writeText(invite); } catch { setInviteError("Clipboard access is unavailable. Select and copy the invite link manually."); }
  }
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="STUDENT / TEAM" title="My team" description="Team membership and invitations are managed by the JudgeForge API." actions={<Link className="button button--quiet" href="/participant">← Overview</Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading team" description="Retrieving your current membership." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Team could not be loaded" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" && !resource.data ? <StatePanel variant="empty" title="No team yet" description="Create a team or join an existing one with a valid invitation token."><div className="panel-actions"><Link className="button button--primary" href="/participant/team/create">Create a team</Link><Link className="button button--quiet" href="/participant/team/join">Join a team</Link></div></StatePanel> : null}
    {resource.status === "ready" && resource.data ? <div className="content-grid content-grid--two">
      <Panel title={resource.data.name} description="Team profile and current status." action={<StatusBadge tone={statusTone(resource.data.status)}>{resource.data.status}</StatusBadge>}>
        <div className="detail-facts"><div><small>TEAM ID</small><strong>{resource.data.id}</strong></div><div><small>MEMBERS</small><strong>{resource.data.members.length}</strong></div><div><small>EVENT</small><strong>DOGFOOD 2026</strong></div></div>
        <div className="member-list">{resource.data.members.map((member, index) => <div className="member-row" key={member.id}><span className="avatar">{member.name.slice(0, 1).toUpperCase()}</span><div><strong>{member.name}</strong><small>{member.email ?? (index === 0 ? "Team member" : "Member")}</small></div></div>)}</div>
      </Panel>
      <Panel title="Invite teammates" description="Create an API-issued link. Anyone joining still needs a valid account.">
        {invite ? <div className="invite-link-box"><label htmlFor="invite-url">Invite link</label><div><input id="invite-url" readOnly value={invite} /><button type="button" className="button button--quiet" onClick={copyInvite}>Copy</button></div></div> : <div className="empty-inline">No active invitation link is displayed. Generate one when you are ready to invite a teammate.</div>}
        {inviteError ? <div className="form-error" role="alert">{inviteError}</div> : null}
        <button className="button button--primary" type="button" disabled={inviteBusy} onClick={() => void generateInvite(resource.data!)}>{inviteBusy ? "Creating link…" : "Generate invite link"}</button>
        <p className="field-help">The invitation is created by the backend and may have an expiry or usage limit.</p>
      </Panel>
      <Panel title="Project attached to this team" description="Create a new submission or continue editing a draft.">
        <div className="panel-actions"><Link className="button button--primary" href="/participant/projects/new">New project</Link><Link className="button button--quiet" href="/participant/projects">View team projects</Link></div>
      </Panel>
    </div> : null}
  </>;
}

export function CreateTeamPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const loadEvents = useCallback(() => getEvents(), []);
  const events = useAsyncResource(loadEvents);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (!token) throw new Error("Your session has expired. Sign in again.");
      const eventId = events.status === "ready" ? events.data[0]?.id : undefined;
      if (!eventId) throw new Error("No event is available for team creation.");
      await createTeam(token, { name: name.trim(), event_id: eventId });
      router.push("/participant/team");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create the team."); }
    finally { setBusy(false); }
  }
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="STUDENT / TEAM SETUP" title="Create your team" description="Choose a name, then invite teammates from your team workspace." actions={<Link className="button button--quiet" href="/participant/team">Cancel</Link>} />
    {events.status === "error" ? <Notice tone="coral" title="Event list unavailable">{events.error}</Notice> : null}
    <Panel className="form-panel" title="Team details" description="The backend validates membership and event eligibility.">
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      <form className="form-stack" onSubmit={submit}>
        <label className="field"><span>Team name</span><input required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. North Star" /></label>
        <label className="field"><span>Event</span><input readOnly value={events.status === "ready" ? events.data[0]?.name ?? "No event available" : "Loading event…"} /></label>
        <div className="form-actions"><button type="submit" className="button button--primary" disabled={busy || events.status !== "ready"}>{busy ? "Creating…" : "Create team"}</button><Link className="button button--quiet" href="/participant/team/join">I have an invite link</Link></div>
      </form>
    </Panel>
  </>;
}

export function JoinTeamForm({ inviteToken }: { inviteToken: string }) {
  const { token } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState<TeamRecord | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try { if (!token) throw new Error("Your session has expired."); const team = await (await import("@/lib/api/portal")).joinTeam(token, inviteToken); setJoined(team); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "This invitation could not be accepted."); }
    finally { setBusy(false); }
  }
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="STUDENT / TEAM SETUP" title="Join a team" description="Enter the invitation token shared by a teammate." actions={<Link className="button button--quiet" href="/participant/team">Cancel</Link>} />
    {joined ? <Notice tone="mint" title={`Joined ${joined.name}`}>Your membership was accepted by the backend. <button className="text-button" type="button" onClick={() => router.push("/participant/team")}>Open team →</button></Notice> : <Panel className="form-panel" title="Accept an invitation" description="Invitation expiry and eligibility are checked by the backend.">
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      <form className="form-stack" onSubmit={submit}><label className="field"><span>Invitation token</span><input required value={inviteToken} readOnly={Boolean(inviteToken)} placeholder="Paste the token from your invite link" /></label><button type="submit" className="button button--primary" disabled={busy || !inviteToken}>{busy ? "Joining…" : "Join team"}</button></form>
      {!inviteToken ? <p className="field-help">Open the complete invite link, or ask your teammate for the invitation token.</p> : null}
    </Panel>}
  </>;
}

export function ParticipantProjectsPage() {
  const { token } = useAuth();
  const load = useCallback(() => token ? getMyProjects(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  const projects: ProjectRecord[] = resource.status === "ready" ? resource.data : [];
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="STUDENT / PROJECTS" title="My projects" description="Draft, edit, and submit your team's project." actions={<Link className="button button--primary" href="/participant/projects/new">New project <span aria-hidden="true">→</span></Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading projects" description="Retrieving your team's projects." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Projects unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" && projects.length === 0 ? <StatePanel variant="empty" title="No projects yet" description="Start a draft and complete the required project details before submitting."><Link className="button button--primary" href="/participant/projects/new">Create first project</Link></StatePanel> : null}
    {resource.status === "ready" && projects.length > 0 ? <Panel title="Project submissions" description={`${projects.length} project${projects.length === 1 ? "" : "s"} returned for your account.`}><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Project</th><th>Track</th><th>Team</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{projects.map((project) => <tr key={project.id}><td><strong>{project.title}</strong><small>{project.summary}</small></td><td>{project.track}</td><td>{project.team}</td><td><StatusBadge tone={statusTone(project.status)}>{project.status}</StatusBadge></td><td>{project.submittedAt ? formatSubmittedAt(project.submittedAt) : "—"}</td><td><Link className="row-link" href={`/participant/projects/edit?id=${encodeURIComponent(project.id)}`}>Edit →</Link></td></tr>)}</tbody></table></div></Panel> : null}
    <Notice tone="quiet" title="Deadline enforcement">The project editor shows the current event deadline. JudgeForge remains authoritative and may reject edits or submissions after closing.</Notice>
  </>;
}
