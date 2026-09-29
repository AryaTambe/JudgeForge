"use client";

import Link from "next/link";
import { useCallback } from "react";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { MetricCard } from "@/components/ui/MetricCard";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { listEventRecords } from "@/lib/api/organizer";

export function AdminDashboard() {
  const { token } = useAuth();
  const load = useCallback(() => token ? listEventRecords(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ADMIN / SYSTEM" title="Administration" description="Platform-level overview. Administrative access is still validated by the JudgeForge backend." />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading admin overview" description="Retrieving the available system event list." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Admin data unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" ? <>
      <div className="metric-grid metric-grid--three"><MetricCard label="Events returned" value={resource.data.length} note="Via the confirmed event list endpoint" /><MetricCard label="User directory" value="Not available" note="No user collection route in supplied contract" accent="amber" /><MetricCard label="Admin mutations" value="Not mapped" note="No admin-specific route schema supplied" accent="coral" /></div>
      <div className="content-grid content-grid--two">
        <Panel title="System events" description="Read-only view of events accessible to this account." action={<Link className="text-link" href="/admin/events">Open event list →</Link>}>
          {resource.data.length ? resource.data.slice(0, 4).map((event) => <div className="event-list-row" key={event.id}><div><strong>{event.name}</strong><small>{event.startDate ? new Date(event.startDate).toLocaleDateString() : "No date"}</small></div><StatusBadge tone={event.status === "closed" ? "coral" : event.status === "open" ? "mint" : "amber"}>{event.status}</StatusBadge></div>) : <div className="empty-inline">No event records returned.</div>}
        </Panel>
        <Panel title="Administrative routes" description="The frontend does not imply that an unsupported endpoint is available."><div className="compact-list"><Link className="compact-row compact-row--link" href="/admin/users"><div><strong>User directory</strong><small>Requires a documented admin-authorized collection route.</small></div><span>→</span></Link><Link className="compact-row compact-row--link" href="/admin/events"><div><strong>Event directory</strong><small>Read-only until admin mutation routes are confirmed.</small></div><span>→</span></Link></div></Panel>
      </div>
      <Notice tone="quiet" title="Backend contract gap">The supplied video and route proposal identify participant, judge, and organizer endpoints, but do not document admin-specific user management or global system mutations.</Notice>
    </> : null}
  </>;
}

export function AdminUsersPage() {
  return <><FixtureBanner /><PageHeader eyebrow="ADMIN / USERS" title="User directory" description="Manage accounts only through documented, backend-authorized admin routes." /><StatePanel variant="empty" title="User list endpoint not supplied" description="The current JudgeForge contract does not include a GET users collection or admin user-management route. This screen stays read-only until the backend exposes one." /><Notice tone="quiet" title="No synthetic accounts">No user directory is fabricated from frontend fixtures. Admin authority and returned user records must come from the backend.</Notice></>;
}

export function AdminEventsPage() {
  const { token } = useAuth();
  const load = useCallback(() => token ? listEventRecords(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ADMIN / EVENTS" title="System events" description="Read-only event inventory; admin event mutations are not defined in the supplied API contract." />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading events" description="Reading the event collection." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Event list unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" ? <Panel title={`${resource.data.length} event records`} description="The event-list route is confirmed; admin-level editing is not.">
      {resource.data.length ? <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Event</th><th>Start</th><th>Submission deadline</th><th>Status</th></tr></thead><tbody>{resource.data.map((event) => <tr key={event.id}><td><strong>{event.name}</strong><small>{event.description}</small></td><td>{event.startDate ? new Date(event.startDate).toLocaleString() : "—"}</td><td>{event.submissionDeadline ? new Date(event.submissionDeadline).toLocaleString() : "—"}</td><td><StatusBadge tone={event.status === "closed" ? "coral" : event.status === "open" ? "mint" : "amber"}>{event.status}</StatusBadge></td></tr>)}</tbody></table></div> : <div className="empty-inline">No event records returned.</div>}
    </Panel> : null}
    <Notice tone="quiet" title="Role boundary">This page does not enable global event editing unless the backend contract explicitly grants and exposes it.</Notice>
  </>;
}
