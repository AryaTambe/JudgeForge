"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FixtureBanner } from "@/components/ui/FixtureBanner";
import { MetricCard } from "@/components/ui/MetricCard";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatePanel } from "@/components/ui/StatePanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { getAssignments, getProgress, getRubric, submitScores } from "@/lib/api/portal";
import { FIXTURE_DATA_ENABLED } from "@/lib/api/config";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import type { AssignmentRecord, RubricCriterion } from "@/types/portal";

function ReviewStatusBadge({ status }: { status: string }) {
  const tone = status === "completed" ? "mint" : status === "in_progress" ? "blue" : status === "pending" ? "amber" : "neutral";
  return <StatusBadge tone={tone}>{status.replaceAll("_", " ")}</StatusBadge>;
}

export function JudgeDashboard() {
  const { token } = useAuth();
  const load = useCallback(async () => {
    if (!token) throw new Error("Your session has expired.");
    const [assignments, progress] = await Promise.all([getAssignments(token), getProgress(token)]);
    return { assignments, progress };
  }, [token]);
  const resource = useAsyncResource(load);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="JUDGE / OVERVIEW" title="Your judging workspace" description="Only assignments returned for your JudgeForge account are shown here." actions={<Link className="button button--primary" href="/judge/assignments">Open assignments →</Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading assignments" description="Retrieving your own judging work and progress." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Judge data unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" ? <>
      <div className="metric-grid metric-grid--three"><MetricCard label="Assignments" value={resource.data.assignments.length} note="Returned for your account" /><MetricCard label="Completed reviews" value={resource.data.progress.completedReviews} note={`${resource.data.progress.pendingReviews} pending`} accent="mint" /><MetricCard label="Progress" value={`${resource.data.progress.totalReviews ? Math.round(resource.data.progress.completedReviews / resource.data.progress.totalReviews * 100) : 0}%`} note={`${resource.data.progress.completedReviews} / ${resource.data.progress.totalReviews}`} accent="amber" /></div>
      <Panel title="Judging progress" description="Progress is calculated from the backend's assignment and review records."><ProgressBar value={resource.data.progress.completedReviews} max={resource.data.progress.totalReviews} label="Reviews completed" showPercent={false} /></Panel>
      <Panel title="Next reviews" description="Start or continue a review from your own assignment list." action={<Link className="text-link" href="/judge/assignments">All assignments →</Link>}>
        {resource.data.assignments.length ? <div className="compact-list">{resource.data.assignments.slice(0, 5).map((assignment) => <div className="compact-row" key={assignment.id}><div><strong>{assignment.project.title}</strong><small>{assignment.project.track} · {assignment.project.team}</small></div><ReviewStatusBadge status={assignment.status} /><Link className="row-link" href={`/judge/review?id=${encodeURIComponent(assignment.project.id)}`}>{assignment.status === "completed" ? "View" : "Review"} →</Link></div>)}</div> : <StatePanel variant="empty" title="No assignments yet" description="An organizer needs to assign projects to your judge account." />}
      </Panel>
      <Notice tone="quiet" title="Judging privacy">The frontend requests only the assignment endpoint for the current session. Peer scores must remain blocked by the backend, including direct API requests.</Notice>
    </> : null}
  </>;
}

export function JudgeAssignmentsPage() {
  const { token } = useAuth();
  const load = useCallback(() => token ? getAssignments(token) : Promise.reject(new Error("Your session has expired.")), [token]);
  const resource = useAsyncResource(load);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="JUDGE / ASSIGNMENTS" title="Assigned projects" description="This list is sourced from the current judge's authenticated assignment endpoint." actions={<Link className="button button--quiet" href="/judge">← Overview</Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading assigned projects" description="The API determines which projects belong to your judge account." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Assignments unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {resource.status === "ready" && resource.data.length === 0 ? <StatePanel variant="empty" title="Nothing assigned yet" description="When an organizer assigns projects to you, they will appear here." /> : null}
    {resource.status === "ready" && resource.data.length > 0 ? <Panel title={`${resource.data.length} assignments`} description="Peer assignments and peer scores are not requested or displayed."><div className="assignment-grid">{resource.data.map((assignment) => <article className="assignment-card" key={assignment.id}><div className="assignment-card__top"><span className="eyebrow">ASSIGNED PROJECT</span><ReviewStatusBadge status={assignment.status} /></div><h2>{assignment.project.title}</h2><p>{assignment.project.summary}</p><div className="assignment-card__facts"><span>{assignment.project.team}</span><span>{assignment.project.track}</span></div><div className="assignment-card__actions">{assignment.project.repositoryUrl ? <a href={assignment.project.repositoryUrl} target="_blank" rel="noreferrer">Repository ↗</a> : null}{assignment.project.demoUrl ? <a href={assignment.project.demoUrl} target="_blank" rel="noreferrer">Demo ↗</a> : null}<Link className="button button--primary" href={`/judge/review?id=${encodeURIComponent(assignment.project.id)}`}>{assignment.status === "completed" ? "Review submitted" : "Open review"} →</Link></div></article>)}</div></Panel> : null}
  </>;
}

interface ReviewLoad { assignment: AssignmentRecord; criteria: RubricCriterion[] }

export function JudgeReviewPage({ projectId }: { projectId: string }) {
  const { token } = useAuth();
  const router = useRouter();
  const load = useCallback(async (): Promise<ReviewLoad> => {
    if (!token) throw new Error("Your session has expired.");
    const assignments = await getAssignments(token);
    const assignment = assignments.find((item) => item.project.id === projectId);
    if (!assignment) throw new Error("This project is not in the assignment list returned for your account. Ask an organizer to check your assignment.");
    const criteria = await getRubric(token, assignment.rubricId);
    return { assignment, criteria };
  }, [token, projectId]);
  const resource = useAsyncResource(load);
  const [scores, setScores] = useState<Record<string, { score: number | null; comment: string }>>({});
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const allScored = resource.status === "ready" && resource.data.criteria.length > 0 && resource.data.criteria.every((criterion) => scores[criterion.id]?.score !== null && scores[criterion.id]?.score !== undefined && Boolean(scores[criterion.id]?.comment.trim()));
  const weightedPreview = (() => {
    if (resource.status !== "ready") return null;
    const rows = resource.data.criteria;
    if (!rows.length || !rows.every((criterion) => scores[criterion.id]?.score)) return null;
    const weightTotal = rows.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (weightTotal <= 0) return null;
    return rows.reduce((sum, criterion) => sum + Number(scores[criterion.id]?.score) * criterion.weight, 0) / weightTotal;
  })();

  function setScore(criterionId: string, score: number) {
    setScores((current) => ({ ...current, [criterionId]: { score, comment: current[criterionId]?.comment ?? "" } }));
  }
  function setComment(criterionId: string, comment: string) {
    setScores((current) => ({ ...current, [criterionId]: { score: current[criterionId]?.score ?? null, comment } }));
  }
  async function persistEvaluation() {
    setError(""); setBusy(true);
    try {
      if (!token || resource.status !== "ready") throw new Error("Review data is unavailable.");
      await submitScores(token, resource.data.assignment.project.id, resource.data.criteria.map((criterion) => ({ criterion_id: criterion.id, score: Number(scores[criterion.id].score), comment: scores[criterion.id].comment.trim() })));
      setComplete(true); setConfirm(false);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The evaluation could not be submitted."); }
    finally { setBusy(false); }
  }

  return <>
    <FixtureBanner />
    <PageHeader eyebrow="JUDGE / REVIEW" title="Project evaluation" description="Score each criterion and leave actionable feedback. The backend owns authorization and submission state." actions={<Link className="button button--quiet" href="/judge/assignments">← Assignments</Link>} />
    {resource.status === "loading" ? <StatePanel variant="loading" title="Loading project and rubric" description="Verifying the assignment and resolving its rubric." /> : null}
    {resource.status === "error" ? <StatePanel variant="error" title="Review unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /> : null}
    {complete ? <Notice tone="mint" title="Evaluation submitted">{FIXTURE_DATA_ENABLED ? "Evaluation saved in this authenticated session's synthetic data; nothing was sent to the backend." : "The API accepted your evaluation. Your own completed status will appear after assignments refresh."} <button className="text-button" type="button" onClick={() => router.push("/judge/assignments")}>Return to assignments →</button></Notice> : null}
    {resource.status === "ready" ? <>
      <section className="review-project-summary"><div><p className="eyebrow">ASSIGNED TO YOUR ACCOUNT</p><h2>{resource.data.assignment.project.title}</h2><p>{resource.data.assignment.project.summary}</p><div className="assignment-card__facts"><span>{resource.data.assignment.project.team}</span><span>{resource.data.assignment.project.track}</span></div></div><div className="review-project-links">{resource.data.assignment.project.repositoryUrl ? <a href={resource.data.assignment.project.repositoryUrl} target="_blank" rel="noreferrer">Repository ↗</a> : null}{resource.data.assignment.project.demoUrl ? <a href={resource.data.assignment.project.demoUrl} target="_blank" rel="noreferrer">Demo ↗</a> : null}</div></section>
      <Notice tone="quiet" title="Independent evaluation">You are scoring only the project assigned to your account. No peer scores, comments, or identities are loaded on this page.</Notice>
      {resource.data.criteria.length === 0 ? <StatePanel variant="empty" title="No rubric criteria" description="The backend did not return criteria for this assignment. Ask the organizer to configure a rubric." /> : <Panel title="Judging rubric" description="Choose a score from 1–5 and provide specific feedback for every criterion.">
        {error ? <div className="form-error" role="alert">{error}</div> : null}
        <form className="rubric-review-form" onSubmit={(event) => { event.preventDefault(); setConfirm(true); }}>
          {resource.data.criteria.map((criterion, index) => <section className="review-criterion" key={criterion.id}><div className="review-criterion__heading"><span className="criterion-index">{String(index + 1).padStart(2, "0")}</span><div><h3>{criterion.name}</h3><p>{criterion.description}</p></div><span className="weight-pill">{criterion.weight}%</span></div><fieldset className="score-fieldset" disabled={complete}><legend>Score <span className="field-required">required</span></legend><div className="score-options">{[1, 2, 3, 4, 5].map((score) => <label className={`score-option${scores[criterion.id]?.score === score ? " is-selected" : ""}`} key={score}><input type="radio" name={`score-${criterion.id}`} value={score} checked={scores[criterion.id]?.score === score} onChange={() => setScore(criterion.id, score)} required /><span>{score}</span><small>{["Needs work", "Developing", "Solid", "Strong", "Exceptional"][score - 1]}</small></label>)}</div></fieldset><label className="field"><span>Feedback <small>Required</small></span><textarea required minLength={3} maxLength={2000} rows={3} disabled={complete} value={scores[criterion.id]?.comment ?? ""} onChange={(event) => setComment(criterion.id, event.target.value)} placeholder="Give the team concrete, constructive feedback." /></label></section>)}
          {weightedPreview !== null ? <div className="weighted-preview"><span>Weighted scoring preview</span><strong>{weightedPreview.toFixed(2)} / 5</strong><small>Provisional only. Final score and any normalization come from the backend.</small></div> : null}
          {!complete ? <div className="form-actions"><button className="button button--primary" type="submit" disabled={!allScored || busy}>Review and submit evaluation →</button></div> : null}
        </form>
      </Panel>}
      {confirm && allScored ? <div className="confirm-submit" role="alert"><div><strong>Submit this evaluation?</strong><p>Scores and feedback will be sent to JudgeForge and may not be editable after submission.</p></div><div className="form-actions"><button className="button button--quiet" type="button" onClick={() => setConfirm(false)}>Continue reviewing</button><button className="button button--primary" type="button" disabled={busy} onClick={() => void persistEvaluation()}>{busy ? "Submitting…" : "Confirm evaluation"}</button></div></div> : null}
    </> : null}
  </>;
}
