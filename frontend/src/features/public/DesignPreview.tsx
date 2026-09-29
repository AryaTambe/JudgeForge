import Link from "next/link";
import type { ReactNode } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { sampleAssignments, sampleEvent, sampleJudges, sampleProgress, sampleProjects, sampleResults, sampleRubric, sampleTeam, sampleUsers } from "@/data/sample-business-data";

type PreviewRole = "participant" | "judge" | "organizer" | "admin";

const rolePages: Array<{ role: PreviewRole; label: string; href: string; detail: string }> = [
  { role: "participant", label: "Student / Participant", href: "/preview/participant", detail: "Team, submissions, and project workspace" },
  { role: "judge", label: "Judge", href: "/preview/judge", detail: "Assignments, rubric, and review screen" },
  { role: "organizer", label: "Organizer", href: "/preview/organizer", detail: "Events, judges, scoring, and results" },
  { role: "admin", label: "Admin", href: "/preview/admin", detail: "User directory and system overview" },
];

const roleTitle: Record<PreviewRole, string> = {
  participant: "Student workspace",
  judge: "Judge workspace",
  organizer: "Organizer workspace",
  admin: "Admin workspace",
};

function DisabledAction({ children }: { children: ReactNode }) {
  return <button className="button button--quiet" type="button" disabled aria-disabled="true">{children}</button>;
}

function ReadOnlyTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return <div className="preview-table-scroll"><table className="preview-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={`${row[0]}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function PreviewNavigation({ current }: { current?: PreviewRole }) {
  return <nav className="preview-role-nav" aria-label="Read-only role previews">
    <Link href="/preview" aria-current={!current ? "page" : undefined}>All previews</Link>
    {rolePages.map((item) => <Link key={item.role} href={item.href} aria-current={current === item.role ? "page" : undefined}>{item.label}</Link>)}
  </nav>;
}

function PreviewFrame({ children, role }: { children: ReactNode; role?: PreviewRole }) {
  return <div className="public-page"><PublicHeader /><main className="public-content public-content--wide">
    <PageHeader eyebrow={`PUBLIC DESIGN PREVIEW${role ? ` / ${role.toUpperCase()}` : ""}`} title={role ? roleTitle[role] : "Explore the internal workspaces"} description={role ? `A representative ${roleTitle[role].toLowerCase()} screen built from Sample Hack 2026 data.` : "Choose a role to inspect its workspace layout using illustrative sample records."} actions={role ? <Link className="button button--quiet" href="/preview">All previews</Link> : <Link className="button button--quiet" href="/login">Real sign in <span aria-hidden="true">→</span></Link>} />
    <Notice tone="amber" title="Public, read-only design preview">This is a separate visual preview using illustrative <strong>Sample Hack 2026</strong> data. It does not sign you in, create a session, contact the JudgeForge API, or save changes. Buttons are disabled; real workspaces remain protected.</Notice>
    <PreviewNavigation current={role} />
    {children}
    <footer className="public-footer"><span>DESIGN ONLY · SAMPLE HACK 2026 · NO LIVE DATA</span><Link href="/">Return to DOGFOOD event overview ↑</Link></footer>
  </main></div>;
}

export function DesignPreviewHub() {
  return <PreviewFrame>
    <section className="public-role-grid" aria-label="Choose a role preview">
      {rolePages.map((item, index) => <Link className="public-role-card" href={item.href} key={item.role}>
        <span>{String(index + 1).padStart(2, "0")} / READ-ONLY</span><strong>{item.label}</strong><small>{item.detail}</small><b aria-hidden="true">→</b>
      </Link>)}
    </section>
    <div className="content-grid content-grid--two preview-info-grid">
      <Panel title="What you can inspect" description="Representative role-specific workspace screens, presented separately from the real authenticated app.">
        <div className="checklist"><div className="checklist-row"><span className="checklist-marker">01</span><span>Student team and submission views</span><StatusBadge tone="blue">Sample</StatusBadge></div><div className="checklist-row"><span className="checklist-marker">02</span><span>Judge assignments and rubric</span><StatusBadge tone="mint">Sample</StatusBadge></div><div className="checklist-row"><span className="checklist-marker">03</span><span>Organizer operations and results</span><StatusBadge tone="amber">Sample</StatusBadge></div><div className="checklist-row"><span className="checklist-marker">04</span><span>Admin directory and event overview</span><StatusBadge tone="coral">Sample</StatusBadge></div></div>
      </Panel>
      <Panel title="This is not a login bypass" description="Preview pages are public mockups, not authenticated workspaces.">
        <p className="preview-copy">No identity or role is created. The original <code>/participant</code>, <code>/judge</code>, <code>/organizer</code>, and <code>/admin</code> routes still require a real JudgeForge session and backend-verified role.</p>
        <div className="panel-actions"><Link className="button button--primary" href="/login">Open real sign in</Link></div>
      </Panel>
    </div>
  </PreviewFrame>;
}

export function RoleDesignPreview({ role }: { role: PreviewRole }) {
  return <PreviewFrame role={role}>
    {role === "participant" ? <ParticipantPreview /> : null}
    {role === "judge" ? <JudgePreview /> : null}
    {role === "organizer" ? <OrganizerPreview /> : null}
    {role === "admin" ? <AdminPreview /> : null}
  </PreviewFrame>;
}

function ParticipantPreview() {
  const project = sampleProjects[0];
  return <>
    <div className="metric-grid metric-grid--three"><MetricCard label="Team" value={sampleTeam.name} note={`${sampleTeam.members.length} sample members`} /><MetricCard label="Projects" value={sampleProjects.length} note="Illustrative submissions" accent="mint" /><MetricCard label="Submission state" value="Submitted" note="Sample record · not live" accent="amber" /></div>
    <div className="content-grid content-grid--two">
      <Panel title="Team roster" description="A representative participant team view." action={<StatusBadge tone="mint">{sampleTeam.status}</StatusBadge>}>
        <div className="member-list">{sampleTeam.members.map((member) => <div className="member-row" key={member.id}><span className="avatar">{member.name.slice(0, 1)}</span><div><strong>{member.name}</strong><small>Sample team member</small></div></div>)}</div>
        <div className="panel-actions"><DisabledAction>Create team</DisabledAction><DisabledAction>Invite teammates</DisabledAction></div>
      </Panel>
      <Panel title="Project submission" description="Example project detail card; repository and demo actions are not active.">
        <div className="preview-project-title"><span className="eyebrow">SAMPLE PROJECT</span><strong>{project.title}</strong><p>{project.summary}</p></div>
        <ReadOnlyTable columns={["Field", "Sample value"]} rows={[["Track", project.track], ["Team", project.team], ["Repository", project.repositoryUrl ? "URL available (not opened)" : "Not provided"], ["Demo", project.demoUrl ? "URL available (not opened)" : "Not provided"]]} />
        <div className="panel-actions"><DisabledAction>Edit project</DisabledAction><DisabledAction>Submit project</DisabledAction></div>
      </Panel>
    </div>
    <Panel title="Submission checklist" description="Visual example only; no event deadlines or save operations are active.">
      <div className="checklist"><div className="checklist-row"><span className="checklist-marker">01</span><span>Join or create a team</span><StatusBadge tone="mint">Sample complete</StatusBadge></div><div className="checklist-row"><span className="checklist-marker">02</span><span>Prepare project details</span><StatusBadge tone="mint">Sample complete</StatusBadge></div><div className="checklist-row"><span className="checklist-marker">03</span><span>Review and submit</span><StatusBadge tone="neutral">Read-only</StatusBadge></div></div>
    </Panel>
  </>;
}

function JudgePreview() {
  return <>
    <div className="metric-grid metric-grid--three"><MetricCard label="Assignments" value={sampleAssignments.length} note="Sample judge queue" /><MetricCard label="Completed" value={sampleAssignments.filter((item) => item.status === "completed").length} note="Illustrative reviews" accent="mint" /><MetricCard label="Pending" value={sampleAssignments.filter((item) => item.status !== "completed").length} note="No submission enabled" accent="amber" /></div>
    <div className="content-grid content-grid--two">
      <Panel title="Assigned projects" description="Only fictional sample assignment records are shown.">
        <div className="compact-list">{sampleAssignments.slice(0, 5).map((item) => <div className="compact-row" key={item.id}><div><strong>{item.project.title}</strong><small>{item.project.track} · {item.project.team}</small></div><StatusBadge tone={item.status === "completed" ? "mint" : "amber"}>{item.status}</StatusBadge><DisabledAction>Open review</DisabledAction></div>)}</div>
      </Panel>
      <Panel title="Evaluation rubric" description="Sample criteria; score controls are disabled in this preview.">
        <ReadOnlyTable columns={["Criterion", "Weight", "Preview control"]} rows={sampleRubric.map((criterion) => [criterion.name, `${criterion.weight}%`, "Score 1–5 · disabled"])} />
        <div className="panel-actions"><DisabledAction>Submit evaluation</DisabledAction></div>
      </Panel>
    </div>
    <Notice tone="quiet" title="No judging data is submitted">This design preview makes no assignment, scoring, or results API calls. It contains illustrative records only.</Notice>
  </>;
}

function OrganizerPreview() {
  const completion = Math.round(sampleProgress.completedReviews / sampleProgress.totalReviews * 100);
  return <>
    <div className="metric-grid metric-grid--four"><MetricCard label="Events" value="1" note="Sample Hack 2026" /><MetricCard label="Projects" value={sampleProjects.length} note="Illustrative records" accent="mint" /><MetricCard label="Judges" value={sampleJudges.length} note="Example accounts" accent="amber" /><MetricCard label="Reviews" value={`${sampleProgress.completedReviews} / ${sampleProgress.totalReviews}`} note={`${completion}% sample completion`} accent="coral" /></div>
    <div className="content-grid content-grid--two">
      <Panel title="Event operations" description="Illustrative event summary; event controls are disabled.">
        <div className="event-list-row"><div><strong>{sampleEvent.name}</strong><small>{sampleEvent.status} · {sampleEvent.tracks.length} sample tracks</small></div><StatusBadge tone="coral">{sampleEvent.status}</StatusBadge></div>
        <div className="panel-actions"><DisabledAction>Create event</DisabledAction><DisabledAction>Edit tracks and prizes</DisabledAction></div>
      </Panel>
      <Panel title="Judging progress" description="Sample completion figures only; not a live judging tally.">
        <div className="progress-summary"><strong>{sampleProgress.completedReviews}<small> / {sampleProgress.totalReviews}</small></strong><span>sample reviews completed</span></div>
        <ProgressBar value={sampleProgress.completedReviews} max={sampleProgress.totalReviews} label="Sample review completion" />
        <div className="mini-stats"><span>Pending <strong>{sampleProgress.pendingReviews}</strong></span><span>Assignments <strong>{sampleAssignments.length}</strong></span><span>Projects complete <strong>{sampleProgress.completedProjects}</strong></span></div>
      </Panel>
    </div>
    <div className="content-grid content-grid--two">
      <Panel title="Judge directory" description="Synthetic example.test accounts only.">
        <ReadOnlyTable columns={["Judge", "Status", "Completed"]} rows={sampleJudges.slice(0, 5).map((judge) => [judge.name, judge.status, `${judge.completedCount} / ${judge.assignedCount}`])} />
        <div className="panel-actions"><DisabledAction>Invite judge</DisabledAction><DisabledAction>Assign projects</DisabledAction></div>
      </Panel>
      <Panel title="Rubric and results" description="Example scoring setup and result rows from the UI brief.">
        <ReadOnlyTable columns={["Criterion", "Weight"]} rows={sampleRubric.map((criterion) => [criterion.name, `${criterion.weight}%`])} />
        <div className="preview-subsection"><strong>Illustrative results — not calculated</strong><ReadOnlyTable columns={["Rank", "Project", "Raw score"]} rows={sampleResults.map((result) => [String(result.rank), result.projectTitle, result.rawScore === null ? "—" : result.rawScore.toFixed(2)])} /></div>
        <div className="panel-actions"><DisabledAction>Save rubric</DisabledAction><DisabledAction>Export CSV</DisabledAction></div>
      </Panel>
    </div>
  </>;
}

function AdminPreview() {
  const users = sampleUsers.map((user) => [user.name, user.email, user.role, user.status]);
  return <>
    <div className="metric-grid metric-grid--three"><MetricCard label="Sample users" value={users.length} note="Synthetic identities only" /><MetricCard label="Events" value="1" note={sampleEvent.name} accent="mint" /><MetricCard label="System status" value="Preview" note="No live service health check" accent="amber" /></div>
    <div className="content-grid content-grid--two">
      <Panel title="User directory" description="All rows are synthetic placeholders using reserved example.test addresses.">
        <ReadOnlyTable columns={["Name", "Email", "Role", "Source"]} rows={users} />
        <div className="panel-actions"><DisabledAction>Change role</DisabledAction><DisabledAction>Invite user</DisabledAction></div>
      </Panel>
      <Panel title="Event inventory" description="Illustrative global event view; admin controls are disabled.">
        <ReadOnlyTable columns={["Event", "Status", "Projects", "Judges"]} rows={[[sampleEvent.name, sampleEvent.status, String(sampleProjects.length), String(sampleJudges.length)]]} />
        <div className="panel-actions"><DisabledAction>Open event settings</DisabledAction><DisabledAction>Review system events</DisabledAction></div>
      </Panel>
    </div>
    <Notice tone="quiet" title="No administrative access is granted">This page is only a public visual mockup. It does not create an admin session, expose live users, or call an admin API.</Notice>
  </>;
}
