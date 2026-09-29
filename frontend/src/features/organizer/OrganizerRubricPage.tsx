"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getRubric, saveRubric } from "@/lib/api/portal";
import { listEventRecords } from "@/lib/api/organizer";
import type { EventRecord, RubricCriterion } from "@/types/portal";

interface RubricLoad { event: EventRecord | null; criteria: RubricCriterion[]; rubricId?: string; warning: string }

export function OrganizerRubricPage() {
  const { token } = useAuth();
  const [draftCriteria, setDraftCriteria] = useState<RubricCriterion[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async (): Promise<RubricLoad> => {
    if (!token) throw new Error("Your session has expired.");
    const events = await listEventRecords(token);
    const event = events[0] ?? null;
    if (!event) return { event: null, criteria: [], warning: "No event is configured." };
    try { return { event, criteria: await getRubric(token, event.rubricId), rubricId: event.rubricId, warning: "" }; }
    catch (reason) { return { event, criteria: [], rubricId: event.rubricId, warning: reason instanceof Error ? reason.message : "No rubric available." }; }
  }, [token]);
  const resource = useAsyncResource(load);
  const loadedCriteria = resource.status === "ready" ? resource.data.criteria : [];
  const criteria = draftCriteria ?? loadedCriteria;
  const total = useMemo(() => criteria.reduce((sum, item) => sum + (Number(item.weight) || 0), 0), [criteria]);
  const valid = criteria.length > 0 && criteria.every((item) => Boolean(item.name.trim()) && item.weight > 0 && item.maxScore >= 1) && total === 100;

  function changeCriteria(updater: (items: RubricCriterion[]) => RubricCriterion[]) { setDraftCriteria((current) => updater(current ?? loadedCriteria)); }
  function addCriterion() { changeCriteria((items) => [...items, { id: `new-${Date.now()}-${Math.random()}`, name: "", description: "", weight: 0, maxScore: 5 }]); }
  function updateCriterion(id: string, field: keyof RubricCriterion, value: string) {
    changeCriteria((items) => items.map((item) => item.id === id ? { ...item, [field]: field === "weight" || field === "maxScore" ? Number(value) : value } : item));
  }
  function removeCriterion(id: string) { changeCriteria((items) => items.filter((item) => item.id !== id)); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (!valid) { setError("Every criterion needs a name, a positive weight, and a maximum score; all weights must total exactly 100%."); return; }
    setBusy(true);
    try {
      if (!token || resource.status !== "ready" || !resource.data.event) throw new Error("No event is available for this rubric.");
      const saved = await saveRubric(token, criteria, resource.data.rubricId, resource.data.event.id);
      setDraftCriteria(saved);
      setMessage("The rubric was saved. Backend responses remain authoritative for judge assignments and final scores.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save the rubric."); }
    finally { setBusy(false); }
  }

  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / JUDGING" title="Scoring rubric" description="Build weighted criteria that every judge applies consistently." />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading rubric" description="Resolving the active event and its rubric." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Rubric unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" && !resource.data.event ? <StatePanel variant="empty" title="No event configured" description="Create an event before configuring its rubric." /> : null}
    {resource.status === "ready" && resource.data.event ? <>
      {resource.data.warning ? <Notice tone="amber" title="No active rubric was resolved">{resource.data.warning} You can still draft criteria below; the event/rubric association must be supported by the backend.</Notice> : null}
      {message ? <Notice tone="mint" title="Rubric saved">{message}</Notice> : null}{error ? <div className="form-error" role="alert">{error}</div> : null}
      <Panel title={`Rubric · ${resource.data.event.name}`} description="Weights must total exactly 100%. Score scale is configurable per criterion." action={<StatusBadge tone={valid ? "mint" : "amber"}>{valid ? "Valid · 100%" : `Total · ${total}%`}</StatusBadge>}>
        <form onSubmit={submit}>
          <div className="rubric-header"><span>CRITERION</span><span>WEIGHT</span><span>MAX SCORE</span><span><span className="sr-only">Actions</span></span></div>
          <div className="rubric-editor-list">{criteria.map((criterion, index) => <div className="rubric-editor-row" key={criterion.id}><div className="rubric-editor-name"><span className="criterion-index">{String(index + 1).padStart(2, "0")}</span><div className="form-stack"><label className="field"><span>Criterion name</span><input required value={criterion.name} onChange={(event) => updateCriterion(criterion.id, "name", event.target.value)} placeholder="e.g. Technical Quality" /></label><label className="field"><span>Description</span><input value={criterion.description} onChange={(event) => updateCriterion(criterion.id, "description", event.target.value)} placeholder="What should judges evaluate?" /></label></div></div><label className="field"><span>Weight (%)</span><input required type="number" min="1" max="100" step="1" value={criterion.weight} onChange={(event) => updateCriterion(criterion.id, "weight", event.target.value)} /></label><label className="field"><span>Max score</span><input required type="number" min="1" max="10" step="1" value={criterion.maxScore} onChange={(event) => updateCriterion(criterion.id, "maxScore", event.target.value)} /></label><button type="button" className="text-button text-button--danger" onClick={() => removeCriterion(criterion.id)} aria-label={`Remove ${criterion.name || "criterion"}`}>Remove</button></div>)}</div>
          <div className="rubric-total"><button type="button" className="button button--quiet" onClick={addCriterion}>+ Add criterion</button><div><span>Total weight</span><strong className={total === 100 ? "weight-valid" : "weight-invalid"}>{total}%</strong></div></div>
          <div className="form-actions form-actions--end"><button type="submit" className="button button--primary" disabled={busy || !valid}>{busy ? "Saving rubric…" : "Save rubric →"}</button></div>
        </form>
      </Panel>
      <Notice tone="quiet" title="Scoring integrity">This interface validates weights locally; the backend must also enforce rubric permissions and validate the saved weight total.</Notice>
    </> : null}
  </>;
}
