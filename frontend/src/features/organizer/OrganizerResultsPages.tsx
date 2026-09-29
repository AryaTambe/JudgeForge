"use client";

import { useCallback, useState } from "react";
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
import { downloadTextFile } from "@/lib/api/download";
import { exportResults, getProgress, getResults } from "@/lib/api/portal";
import type { ResultRecord, ReviewProgress } from "@/types/portal";

async function settle<T>(promise: Promise<T>): Promise<{ data: T | null; error: string }> {
  try { return { data: await promise, error: "" }; }
  catch (reason) { return { data: null, error: reason instanceof Error ? reason.message : "The API request failed." }; }
}
interface ResultsLoad { results: { data: ResultRecord[] | null; error: string }; progress: { data: ReviewProgress | null; error: string } }
const number = (value: number | null, decimals = 2) => value === null ? "—" : value.toFixed(decimals);

export function OrganizerResultsPage() {
  const { token } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const load = useCallback(async (): Promise<ResultsLoad> => {
    if (!token) throw new Error("Your session has expired.");
    const [results, progress] = await Promise.all([settle(getResults(token)), settle(getProgress(token))]);
    return { results, progress };
  }, [token]);
  const resource = useAsyncResource(load);
  async function download() {
    setExporting(true); setExportError("");
    try { if (!token) throw new Error("Your session has expired."); downloadTextFile("dogfood-results.csv", await exportResults(token)); }
    catch (reason) { setExportError(reason instanceof Error ? reason.message : "CSV export failed."); }
    finally { setExporting(false); }
  }
  if (resource.status === "loading") return <><FixtureBanner /><PageHeader eyebrow="ORGANIZER / OUTCOMES" title="Results" description="Rankings and CSV export from the backend." /><StatePanel variant="loading" title="Loading results" description="Retrieving rankings and judging progress." /></>;
  if (resource.status === "error") return <><FixtureBanner /><PageHeader eyebrow="ORGANIZER / OUTCOMES" title="Results" /><StatePanel variant="error" title="Results unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /></>;
  const results = resource.data.results.data;
  const progress = resource.data.progress.data;
  const errors = [resource.data.results.error, resource.data.progress.error].filter(Boolean);
  const average = results?.filter((row) => row.rawScore !== null).map((row) => row.rawScore as number) ?? [];
  const mean = average.length ? average.reduce((sum, score) => sum + score, 0) / average.length : null;
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / OUTCOMES" title="Results" description="Show only ranks, scores, and normalization values returned by the API." actions={<button type="button" className="button button--primary" onClick={() => void download()} disabled={exporting}>{exporting ? "Preparing CSV…" : "Export CSV ↓"}</button>} />
    {errors.length ? <Notice tone="amber" title="Some results modules are unavailable">{[...new Set(errors)].join(" · ")}</Notice> : null}
    {exportError ? <div className="form-error" role="alert">{exportError}</div> : null}
    <div className="metric-grid metric-grid--three"><MetricCard label="Ranked projects" value={results ? results.length : "—"} note="Returned by the results endpoint" /><MetricCard label="Average raw score" value={mean === null ? "—" : mean.toFixed(2)} note="Not recomputed when API values are absent" accent="mint" /><MetricCard label="Judging completion" value={progress ? `${progress.completedReviews}/${progress.totalReviews}` : "—"} note={progress ? `${progress.totalReviews ? Math.round(progress.completedReviews / progress.totalReviews * 100) : 0}% complete` : "Progress unavailable"} accent="amber" /></div>
    <Panel title="Project rankings" description="Raw and normalized scores remain separate fields; the frontend does not invent normalization.">
      {!results?.length ? <StatePanel variant="empty" title="No results yet" description="Rankings appear when the backend publishes results." /> : <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Rank</th><th>Project</th><th>Team</th><th>Track</th><th>Raw score</th><th>Normalized score</th><th>Reviews</th></tr></thead><tbody>{results.map((result) => <tr key={result.projectId}><td>{result.rank ? <strong className="rank-number">#{result.rank}</strong> : "—"}</td><td><strong>{result.projectTitle}</strong></td><td>{result.team}</td><td>{result.track}</td><td>{number(result.rawScore)}</td><td>{result.normalizedScore === null ? <span className="muted">Not provided</span> : number(result.normalizedScore)}</td><td>{result.reviewCount}</td></tr>)}</tbody></table></div>}
    </Panel>
    <Notice tone="quiet" title="Score provenance">The table uses backend response values. It does not average individual scores or calculate normalized scores in the browser.</Notice>
  </>;
}

export function OrganizerIntegrityPage() {
  const { token } = useAuth();
  const load = useCallback(async () => {
    if (!token) throw new Error("Your session has expired.");
    const [progress, results] = await Promise.all([settle(getProgress(token)), settle(getResults(token))]);
    return { progress, results };
  }, [token]);
  const resource = useAsyncResource(load);
  if (resource.status === "loading") return <><FixtureBanner /><PageHeader eyebrow="ORGANIZER / INTEGRITY" title="Judging integrity" description="Coverage, assignment distribution, and normalization transparency." /><StatePanel variant="loading" title="Loading integrity data" description="Fetching review counts, variance, and any API-supplied explanations." /></>;
  if (resource.status === "error") return <><FixtureBanner /><PageHeader eyebrow="ORGANIZER / INTEGRITY" title="Judging integrity" /><StatePanel variant="error" title="Integrity data unavailable" description={resource.error} actionLabel="Retry" onAction={resource.reload} /></>;
  const { progress: p, results: r } = resource.data;
  const progress = p.data;
  const results = r.data;
  const errors = [p.error, r.error].filter(Boolean);
  return <>
    <FixtureBanner />
    <PageHeader eyebrow="ORGANIZER / T2" title="Judging integrity" description="A transparent view of whether reviews are complete and what the backend says about score normalization." />
    {errors.length ? <Notice tone="amber" title="Integrity API data is partial">{[...new Set(errors)].join(" · ")}</Notice> : null}
    {progress ? <>
      <div className="metric-grid metric-grid--four"><MetricCard label="Total reviews" value={progress.totalReviews} note="Assigned review records" /><MetricCard label="Completed" value={progress.completedReviews} note={`${progress.totalReviews ? Math.round(progress.completedReviews / progress.totalReviews * 100) : 0}%`} accent="mint" /><MetricCard label="Pending" value={progress.pendingReviews} note="Awaiting a judge submission" accent="amber" /><MetricCard label="Score variance" value={progress.scoreVariance === null ? "Not provided" : progress.scoreVariance.toFixed(3)} note="Backend-reported only" accent="coral" /></div>
      <div className="content-grid content-grid--two">
        <Panel title="Review completion" description="Review totals from the backend progress endpoint."><ProgressBar value={progress.completedReviews} max={progress.totalReviews} label="Reviews completed" showPercent={false} /><div className="mini-stats"><span>Pending <strong>{progress.pendingReviews}</strong></span><span>Projects completed <strong>{progress.completedProjects}/{progress.assignedProjects || "—"}</strong></span><span>Normalization <strong>{progress.normalizationStatus}</strong></span></div></Panel>
        <Panel title="Normalization status" description="A status, method, and explanation should be supplied by the backend."><div className="normalization-status"><StatusBadge tone={progress.normalizationStatus.toLowerCase().includes("not") ? "amber" : "blue"}>{progress.normalizationStatus}</StatusBadge><p>The frontend does not calculate or infer normalized rankings. Missing values are shown as unavailable rather than estimated.</p></div></Panel>
      </div>
      <Panel title="Judge distribution" description="Assigned and completed reviews per judge, as returned by the backend.">
        {progress.judgeDistribution.length ? <div className="distribution-list">{progress.judgeDistribution.map((judge) => <div className="distribution-row" key={judge.judgeName}><span className="distribution-row__name">{judge.judgeName}</span><div className="distribution-row__bar"><ProgressBar value={judge.completed} max={judge.assigned} label={`${judge.completed} of ${judge.assigned} reviews`} showPercent={false} /></div><StatusBadge tone={judge.completed >= judge.assigned ? "mint" : "amber"}>{`${judge.completed}/${judge.assigned}`}</StatusBadge></div>)}</div> : <div className="empty-inline">Judge distribution was not supplied by the API.</div>}
      </Panel>
    </> : <StatePanel variant="empty" title="No integrity metrics" description="The backend progress endpoint did not return integrity metrics." />}
    {results?.length ? <Panel title="Score change explanations" description="Raw/normalized values and ranks are rendered only if returned by the results API."><div className="integrity-result-list">{results.map((result) => <details className="integrity-result" key={result.projectId}><summary><span><strong>{result.projectTitle}</strong><small>{result.team} · {result.track}</small></span><span className="integrity-scores"><span>Raw <strong>{result.rawScore === null ? "—" : result.rawScore.toFixed(2)}</strong></span><span>Normalized <strong>{result.normalizedScore === null ? "Not provided" : result.normalizedScore.toFixed(2)}</strong></span></span><span className="rank-change">{result.rankBefore === null || result.rankAfter === null ? "Rank change unavailable" : `#${result.rankBefore} → #${result.rankAfter}`}</span></summary><div className="integrity-explanation">{result.explanation ?? "The backend has not supplied an explanation for this result."}</div></details>)}</div></Panel> : null}
    <Notice tone="quiet" title="Illustrative example from the frontend brief—not a live result">Project A: raw score 4.21 → normalized score 4.48; rank before #3 → rank after #1. The current UI shows these fields only when the backend supplies them.</Notice>
  </>;
}
