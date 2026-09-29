import galleryFixture from "@/data/project-fixtures.json";
import { sampleAssignments, sampleEvent, sampleJudges, sampleProgress, sampleResults, sampleRubric, sampleTeam } from "@/data/sample-business-data";
import { apiRequest } from "@/lib/api/client";
import { FIXTURE_DATA_ENABLED, isApiConfigured } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { readFixtureState, saveFixtureProject, saveFixtureTeam } from "@/lib/api/fixture-store";
import { asList, normalizeAssignments, normalizeEvent, normalizeEvents, normalizeJudges, normalizeProject, normalizeProjects, normalizeProgress, normalizeResults, normalizeRubric, normalizeTeam, normalizeTeams } from "@/lib/api/normalizers";
import type { AssignmentRecord, EventRecord, JudgeRecord, ProjectRecord, ResultRecord, ReviewProgress, RubricCriterion, TeamRecord } from "@/types/portal";

function fixtureSession(token?: string | null): boolean {
  if (!FIXTURE_DATA_ENABLED) return false;
  if (!token) throw new Error("Synthetic business fixtures are available only after a real JudgeForge login.");
  return true;
}

export const DOGFOOD_EVENT: EventRecord = {
  id: "dogfood-2026",
  name: "DOGFOOD 2026",
  description: "Build the platform that will judge you. A 72-hour hackathon to build an open, self-hostable submission and judging platform.",
  startDate: "2026-09-26T18:00:00Z",
  endDate: "2026-09-29T18:00:00Z",
  submissionDeadline: "2026-09-29T18:00:00Z",
  status: "open",
  tracks: [],
  prizes: [
    { id: "grand", title: "Grand Prize", description: "The platform selected for adoption.", amount: 1200, rank: 1 },
    { id: "runner-up", title: "Runner-Up", description: "Second place.", amount: 600, rank: 2 },
    { id: "third", title: "Third Place", description: "Third place.", amount: 300, rank: 3 },
    { id: "engine", title: "Best Judging Engine", description: "Judging and normalization engine.", amount: 100 },
    { id: "teardown", title: "The Teardown", description: "Three build write-ups at $100 each.", amount: 300 },
  ],
};

export async function getEvents(): Promise<EventRecord[]> {
  if (!isApiConfigured) return [DOGFOOD_EVENT];
  return normalizeEvents(await apiRequest<unknown>(endpoints.events.list));
}

export async function getEvent(id: string, token?: string | null): Promise<EventRecord> {
  if (fixtureSession(token)) return sampleEvent;
  return normalizeEvent(await apiRequest<unknown>(endpoints.events.detail(id), { token }));
}

export async function getPublicProjects(): Promise<ProjectRecord[]> {
  if (!isApiConfigured) return galleryFixture.map((item) => normalizeProject(item));
  return normalizeProjects(await apiRequest<unknown>(endpoints.projects.list));
}

export async function getMyProjects(token: string): Promise<ProjectRecord[]> {
  if (fixtureSession(token)) return readFixtureState().projects;
  return normalizeProjects(await apiRequest<unknown>(endpoints.projects.mine, { token }));
}

export async function getProject(id: string, token?: string | null, publicAccess = false): Promise<ProjectRecord> {
  if (fixtureSession(token)) {
    const found = readFixtureState().projects.find((project) => project.id === id);
    if (!found) throw new Error("Sample project not found.");
    return found;
  }
  if (publicAccess && !isApiConfigured) {
    const item = galleryFixture.find((project) => project.id === id);
    if (!item) throw new Error("Project not found in the Sample Hack 2026 gallery.");
    return normalizeProject(item);
  }
  return normalizeProject(await apiRequest<unknown>(endpoints.projects.detail(id), { token }));
}

export async function getMyTeam(token: string): Promise<TeamRecord | null> {
  if (fixtureSession(token)) return readFixtureState().team;
  const payload = await apiRequest<unknown>(endpoints.teams.mine, { token });
  return normalizeTeams(payload)[0] ?? null;
}

export async function createTeam(token: string, payload: { name: string; event_id?: string }): Promise<TeamRecord> {
  if (fixtureSession(token)) return saveFixtureTeam({ ...sampleTeam, name: payload.name });
  return normalizeTeam(await apiRequest<unknown>(endpoints.teams.create, { method: "POST", token, body: JSON.stringify(payload) }));
}
export async function joinTeam(token: string, inviteToken: string): Promise<TeamRecord> {
  if (fixtureSession(token)) return saveFixtureTeam({ ...sampleTeam, inviteUrl: undefined });
  return normalizeTeam(await apiRequest<unknown>(endpoints.teams.join, { method: "POST", token, body: JSON.stringify({ token: inviteToken }) }));
}

export async function saveProject(token: string, payload: { id?: string; title: string; description: string; track_id: string; repo_url: string; demo_url: string }): Promise<ProjectRecord> {
  if (fixtureSession(token)) {
    const existing = payload.id ? readFixtureState().projects.find((item) => item.id === payload.id) : undefined;
    return saveFixtureProject({ id: payload.id ?? `sample-project-${Date.now()}`, title: payload.title, summary: payload.description, description: payload.description, track: payload.track_id || "Unassigned", team: readFixtureState().team?.name ?? "No team", teamSize: readFixtureState().team?.members.length ?? 0, repositoryUrl: payload.repo_url, demoUrl: payload.demo_url, submittedAt: existing?.submittedAt ?? new Date().toISOString(), status: existing?.status === "submitted" ? "submitted" : "draft" });
  }
  const path = payload.id ? endpoints.projects.update(payload.id) : endpoints.projects.create;
  const body = { title: payload.title, description: payload.description, track_id: payload.track_id, repo_url: payload.repo_url, demo_url: payload.demo_url };
  return normalizeProject(await apiRequest<unknown>(path, { method: payload.id ? "PUT" : "POST", token, body: JSON.stringify(body) }));
}
export async function submitProject(token: string, id: string): Promise<ProjectRecord> {
  if (fixtureSession(token)) {
    const project = readFixtureState().projects.find((item) => item.id === id);
    if (!project) throw new Error("Sample project not found.");
    return saveFixtureProject({ ...project, status: "submitted" });
  }
  return normalizeProject(await apiRequest<unknown>(endpoints.projects.submit(id), { method: "POST", token }));
}

export async function getJudges(token: string): Promise<JudgeRecord[]> {
  if (fixtureSession(token)) return sampleJudges;
  return normalizeJudges(await apiRequest<unknown>(endpoints.judges.list, { token }));
}
export async function inviteJudge(token: string, email: string, eventId?: string): Promise<unknown> {
  if (fixtureSession(token)) return { invited: true, email };
  return apiRequest<unknown>(endpoints.judges.invite, { method: "POST", token, body: JSON.stringify({ email, event_id: eventId }) });
}
export async function getAssignments(token: string): Promise<AssignmentRecord[]> {
  if (fixtureSession(token)) return sampleAssignments;
  return normalizeAssignments(await apiRequest<unknown>(endpoints.judges.assignments, { token }));
}
export async function assignJudges(token: string, payload: { judge_id: string; project_ids: string[] }): Promise<unknown> {
  if (fixtureSession(token)) return { assigned: payload.project_ids.length };
  return apiRequest<unknown>(endpoints.judges.assign, { method: "POST", token, body: JSON.stringify(payload) });
}

export async function getRubric(token: string, id?: string): Promise<RubricCriterion[]> {
  if (fixtureSession(token)) return sampleRubric;
  if (!id) throw new Error("The event or assignment did not provide a rubric ID. The backend contract does not confirm a list/active-rubric route yet.");
  const raw = await apiRequest<unknown>(endpoints.judging.rubricDetail(id), { token });
  return normalizeRubric(raw);
}
export async function saveRubric(token: string, criteria: RubricCriterion[], id?: string, eventId?: string): Promise<RubricCriterion[]> {
  if (fixtureSession(token)) return criteria;
  const body = JSON.stringify({ ...(eventId ? { event_id: eventId } : {}), criteria: criteria.map(({ id: criterionId, name, description, weight, maxScore }) => ({ id: criterionId, name, description, weight, max_score: maxScore })) });
  const raw = await apiRequest<unknown>(id ? endpoints.judging.rubricDetail(id) : endpoints.judging.rubric, { method: id ? "PUT" : "POST", token, body });
  return normalizeRubric(raw);
}
export async function submitScores(token: string, projectId: string, scores: Array<{ criterion_id: string; score: number; comment: string }>): Promise<unknown> {
  if (fixtureSession(token)) return { submitted: true };
  return apiRequest<unknown>(endpoints.judging.scores, { method: "POST", token, body: JSON.stringify({ project_id: projectId, scores }) });
}
export async function getProgress(token: string): Promise<ReviewProgress> {
  if (fixtureSession(token)) return sampleProgress;
  return normalizeProgress(await apiRequest<unknown>(endpoints.judging.progress, { token }));
}
export async function getOrganizerAssignments(token: string): Promise<AssignmentRecord[]> {
  if (fixtureSession(token)) return sampleAssignments;
  return normalizeAssignments(await apiRequest<unknown>(endpoints.judges.assignments, { token }));
}
export async function getResults(token: string): Promise<ResultRecord[]> {
  if (fixtureSession(token)) return sampleResults;
  return normalizeResults(await apiRequest<unknown>(endpoints.results.list, { token }));
}
export async function getProjectResult(token: string, id: string): Promise<ResultRecord> {
  if (fixtureSession(token)) return sampleResults.find((result) => result.projectId === id) ?? sampleResults[0];
  return (await import("@/lib/api/normalizers")).normalizeResult(await apiRequest<unknown>(endpoints.results.project(id), { token }));
}
export async function exportResults(token: string): Promise<string> {
  if (fixtureSession(token)) return "rank,project,score,reviews\n1,Project A,4.72,4\n2,Project B,4.61,4\n3,Project C,4.54,4\n";
  return apiRequest<string>(endpoints.results.csv, { token, headers: { Accept: "text/csv" } });
}
export async function saveEvent(token: string, payload: { id?: string; name: string; description: string; start_date: string; end_date: string; submission_deadline: string }): Promise<EventRecord> {
  if (fixtureSession(token)) return { ...sampleEvent, ...payload, startDate: payload.start_date, endDate: payload.end_date, submissionDeadline: payload.submission_deadline };
  const raw = await apiRequest<unknown>(payload.id ? endpoints.events.update(payload.id) : endpoints.events.create, { method: payload.id ? "PUT" : "POST", token, body: JSON.stringify(payload) });
  return normalizeEvent(raw);
}

export function apiListForDisplay(payload: unknown): unknown[] { return asList(payload); }
