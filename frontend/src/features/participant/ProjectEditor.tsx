"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { FIXTURE_DATA_ENABLED } from "@/lib/api/config";
import { getEvents, getProject, saveProject, submitProject } from "@/lib/api/portal";
import type { EventRecord, ProjectRecord } from "@/types/portal";

interface EditorLoad { events: EventRecord[]; project: ProjectRecord | null }
interface EditorValues { title: string; description: string; trackId: string; repoUrl: string; demoUrl: string }

export function ProjectEditor({ projectId }: { projectId?: string }) {
  const { token } = useAuth();
  const router = useRouter();
  const load = useCallback(async (): Promise<EditorLoad> => {
    const events = await getEvents();
    if (projectId) {
      if (!token) throw new Error("Your session has expired. Sign in again.");
      return { events, project: await getProject(projectId, token) };
    }
    return { events, project: null };
  }, [projectId, token]);
  const resource = useAsyncResource(load);
  const initialProject = resource.status === "ready" ? resource.data.project : null;
  const event = resource.status === "ready" ? resource.data.events[0] : undefined;
  const [activeProject, setActiveProject] = useState<ProjectRecord | null>(null);
  const project = activeProject ?? initialProject;
  const initialValues: EditorValues = project ? {
    title: project.title,
    description: project.description,
    trackId: event?.tracks.find((track) => track.name === project.track)?.id ?? "",
    repoUrl: project.repositoryUrl,
    demoUrl: project.demoUrl,
  } : { title: "", description: "", trackId: "", repoUrl: "", demoUrl: "" };
  const [draft, setDraft] = useState<EditorValues | null>(null);
  const values = draft ?? initialValues;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [deadlineClock, setDeadlineClock] = useState<number | null>(null);

  function updateField<K extends keyof EditorValues>(key: K, value: EditorValues[K]) {
    setDraft((current) => ({ ...initialValues, ...current, [key]: value }));
  }

  useEffect(() => {
    if (!event?.submissionDeadline) return;
    const deadline = new Date(event.submissionDeadline).getTime();
    if (!Number.isFinite(deadline)) return;
    const timer = window.setTimeout(() => setDeadlineClock(Date.now()), Math.max(deadline - Date.now(), 0));
    return () => window.clearTimeout(timer);
  }, [event?.submissionDeadline]);
  const deadlineTimestamp = event?.submissionDeadline ? new Date(event.submissionDeadline).getTime() : Number.NaN;
  const deadlinePassed = deadlineClock !== null && Number.isFinite(deadlineTimestamp) && deadlineClock >= deadlineTimestamp;
  const closed = Boolean(event?.status === "closed" || project?.status === "closed" || deadlinePassed);
  const canSubmit = Boolean(project?.id) && !closed && project?.status !== "submitted";

  async function saveDraft() {
    setBusy(true); setError(""); setNotice("");
    try {
      if (!token) throw new Error("Your session has expired. Sign in again.");
      if (!event) throw new Error("No event is currently available.");
      const saved = await saveProject(token, { id: project?.id, title: values.title.trim(), description: values.description.trim(), track_id: values.trackId, repo_url: values.repoUrl.trim(), demo_url: values.demoUrl.trim() });
      setActiveProject(saved);
      setDraft(null);
      setNotice(FIXTURE_DATA_ENABLED ? "Draft saved to this authenticated session's local synthetic data. Nothing was sent to the backend." : "Draft saved. The backend response has been applied.");
      if (!projectId && saved.id && !saved.id.startsWith("sample-project-")) router.replace(`/participant/projects/edit?id=${encodeURIComponent(saved.id)}`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save the project."); }
    finally { setBusy(false); }
  }

  async function submitSaved(id: string) {
    if (!token) throw new Error("Your session has expired. Sign in again.");
    const result = await submitProject(token, id);
    setActiveProject(result);
    setDraft(null);
    setNotice(FIXTURE_DATA_ENABLED ? "Submission state saved in this authenticated session's synthetic data. Nothing was sent to the backend." : "Project submitted. The backend has confirmed the current submission state.");
    setConfirmSubmit(false);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void saveDraft(); }

  async function confirmSubmission() {
    if (!project?.id) { setError("Save the project draft before submitting."); setConfirmSubmit(false); return; }
    setBusy(true); setError(""); setNotice("");
    try { await submitSaved(project.id); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The backend could not submit this project."); }
    finally { setBusy(false); }
  }

  return <>
    <FixtureBanner />
    <PageHeader eyebrow={`STUDENT / PROJECT ${projectId ? "EDIT" : "NEW"}`} title={projectId ? "Edit project" : "Create a project"} description="Complete the project details, save a draft, then submit when the team is ready." actions={<Link className="button button--quiet" href="/participant/projects">← My projects</Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading project editor" description="Checking event details and the selected project." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Project editor unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" && !event ? <StatePanel variant="empty" title="No event available" description="An organizer must configure an event before you can create a project." /> : null}
    {resource.status === "ready" && event ? <>
      {closed ? <Notice tone="coral" title="Submission deadline passed">Submissions are closed. You can no longer edit or submit this project.</Notice> : null}
      {notice ? <Notice tone="mint" title="Saved">{notice}</Notice> : null}
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      {project ? <div className="editor-status-row"><span>PROJECT STATUS</span><StatusBadge tone={project.status === "submitted" ? "mint" : project.status === "closed" ? "coral" : "amber"}>{project.status}</StatusBadge>{project.submittedAt ? <small>Updated {new Date(project.submittedAt).toLocaleString()}</small> : null}</div> : null}
      <Panel className="form-panel" title="Project details" description={`Event: ${event.name}${event.submissionDeadline ? ` · Deadline: ${new Date(event.submissionDeadline).toLocaleString()}` : ""}`}>
        <form className="form-stack" onSubmit={handleSave}>
          <label className="field"><span>Project title</span><input required minLength={3} maxLength={120} disabled={closed} value={values.title} onChange={(e) => updateField("title", e.target.value)} placeholder="What are you building?" /></label>
          <label className="field"><span>Description</span><textarea required minLength={20} maxLength={5000} rows={6} disabled={closed} value={values.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Explain the problem, your approach, and what works." /><small className="field-help">{values.description.length} / 5,000 characters</small></label>
          <label className="field"><span>Track</span><select disabled={closed || event.tracks.length === 0} required={event.tracks.length > 0} value={values.trackId} onChange={(e) => updateField("trackId", e.target.value)}><option value="">{event.tracks.length ? "Select a track" : "No tracks configured"}</option>{event.tracks.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}</select>{event.tracks.length === 0 ? <small className="field-help">This event has no configured tracks. The track field is optional until the organizer adds one.</small> : null}</label>
          <label className="field"><span>Repository URL</span><input type="url" disabled={closed} value={values.repoUrl} onChange={(e) => updateField("repoUrl", e.target.value)} placeholder="https://github.com/team/project" /></label>
          <label className="field"><span>Demo URL</span><input type="url" disabled={closed} value={values.demoUrl} onChange={(e) => updateField("demoUrl", e.target.value)} placeholder="https://your-demo.example" /></label>
          {!closed ? <div className="form-actions"><button type="submit" className="button button--quiet" disabled={busy}>{busy ? "Saving…" : "Save draft"}</button><button type="button" className="button button--primary" disabled={busy || !canSubmit} onClick={() => setConfirmSubmit(true)}>Submit project <span aria-hidden="true">→</span></button></div> : <p className="field-help">This project is read-only because the event has closed.</p>}
        </form>
      </Panel>
      {confirmSubmit ? <div className="confirm-submit" role="alert"><div><strong>Submit this project now?</strong><p>The backend will record the submission and may lock further edits. Confirm only when your team is ready.</p></div><div className="form-actions"><button type="button" className="button button--quiet" onClick={() => setConfirmSubmit(false)}>Go back</button><button type="button" className="button button--primary" disabled={busy} onClick={() => void confirmSubmission()}>{busy ? "Submitting…" : "Confirm submission"}</button></div></div> : null}
    </> : null}
  </>;
}
