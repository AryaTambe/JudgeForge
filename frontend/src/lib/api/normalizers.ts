import type { AssignmentRecord, EventRecord, EventStatus, JudgeRecord, ProjectRecord, ProjectStatus, ResultRecord, ReviewProgress, ReviewStatus, RubricCriterion, TeamRecord, Track, Prize } from "@/types/portal";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}
function text(value: unknown, fallback = ""): string { return typeof value === "string" || typeof value === "number" ? String(value) : fallback; }
function list(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const wrapper = record(value);
  if (Array.isArray(wrapper.data)) return wrapper.data;
  if (Array.isArray(wrapper.items)) return wrapper.items;
  if (Array.isArray(wrapper.results)) return wrapper.results;
  return [];
}
function statusOf(value: unknown): EventStatus {
  const status = text(value).toLowerCase();
  if (["open", "active", "registration_open"].includes(status)) return "open";
  if (["closed", "complete", "completed"].includes(status)) return "closed";
  if (["upcoming", "draft", "scheduled"].includes(status)) return "upcoming";
  return "unknown";
}
function projectStatus(value: unknown): ProjectStatus {
  const status = text(value).toLowerCase();
  if (["draft", "in_progress"].includes(status)) return "draft";
  if (["submitted", "published", "complete"].includes(status)) return "submitted";
  if (["closed", "locked"].includes(status)) return "closed";
  return "unknown";
}
function reviewStatus(value: unknown): ReviewStatus {
  const status = text(value).toLowerCase();
  if (["completed", "submitted", "complete"].includes(status)) return "completed";
  if (["in_progress", "started"].includes(status)) return "in_progress";
  if (["pending", "assigned", "open"].includes(status)) return "pending";
  return "unknown";
}

export function asList(value: unknown): unknown[] { return list(value); }

export function normalizeTrack(value: unknown): Track {
  const raw = record(value);
  return { id: text(raw.id ?? raw.track_id ?? raw.name), name: text(raw.name ?? raw.title, "Track") };
}
export function normalizePrize(value: unknown): Prize {
  const raw = record(value);
  const amount = Number(raw.amount ?? raw.value);
  const rank = Number(raw.rank);
  return { id: text(raw.id ?? raw.prize_id ?? raw.title), title: text(raw.title ?? raw.name, "Prize"), description: text(raw.description), ...(Number.isFinite(amount) && amount ? { amount } : {}), ...(Number.isFinite(rank) && rank ? { rank } : {}) };
}
export function normalizeEvent(value: unknown): EventRecord {
  const raw = record(value);
  return {
    id: text(raw.id ?? raw.event_id),
    name: text(raw.name ?? raw.title, "Untitled event"),
    description: text(raw.description),
    startDate: text(raw.start_date ?? raw.startDate),
    endDate: text(raw.end_date ?? raw.endDate),
    submissionDeadline: text(raw.submission_deadline ?? raw.submissionDeadline ?? raw.submissions_close),
    rubricId: text(raw.rubric_id ?? raw.rubricId) || undefined,
    status: statusOf(raw.status),
    tracks: list(raw.tracks).map(normalizeTrack),
    prizes: list(raw.prizes).map(normalizePrize),
  };
}
export function normalizeEvents(value: unknown): EventRecord[] { return list(value).map(normalizeEvent); }

export function normalizeProject(value: unknown): ProjectRecord {
  const raw = record(value);
  const team = record(raw.team);
  const track = record(raw.track);
  const title = text(raw.title ?? raw.name, "Untitled project");
  const description = text(raw.description ?? raw.summary);
  const teamName = text(team.name ?? raw.team_name ?? (typeof raw.team === "string" ? raw.team : ""), "Independent");
  const teamSize = Number(raw.team_size ?? raw.teamSize ?? (Array.isArray(team.members) ? team.members.length : 1));
  return {
    id: text(raw.id ?? raw.project_id),
    title,
    summary: text(raw.summary ?? raw.description, "No summary provided."),
    description,
    track: text(track.name ?? raw.track_name ?? (typeof raw.track === "string" ? raw.track : ""), "Unassigned"),
    team: teamName,
    teamSize: Number.isFinite(teamSize) ? teamSize : 1,
    repositoryUrl: text(raw.repo_url ?? raw.repository_url ?? raw.repositoryUrl ?? raw.repoUrl),
    demoUrl: text(raw.demo_url ?? raw.demoUrl),
    submittedAt: text(raw.submitted_at ?? raw.submittedAt ?? raw.created_at),
    status: projectStatus(raw.status),
  };
}
export function normalizeProjects(value: unknown): ProjectRecord[] { return list(value).map(normalizeProject); }

export function normalizeTeam(value: unknown): TeamRecord {
  const raw = record(value);
  const members = list(raw.members ?? raw.team_members).map((item) => {
    const member = record(item);
    return { id: text(member.id ?? member.user_id), name: text(member.name ?? member.full_name ?? member.email, "Member"), ...(member.email ? { email: text(member.email) } : {}) };
  });
  return { id: text(raw.id ?? raw.team_id), name: text(raw.name, "Untitled team"), status: text(raw.status, "Active"), eventId: text(raw.event_id ?? raw.eventId) || undefined, members, inviteUrl: text(raw.invite_url ?? raw.inviteUrl) || undefined };
}
export function normalizeTeams(value: unknown): TeamRecord[] {
  const rows = list(value);
  if (rows.length) return rows.map(normalizeTeam);
  const raw = record(value);
  if (raw.id || raw.team_id) return [normalizeTeam(value)];
  return [];
}

export function normalizeJudge(value: unknown): JudgeRecord {
  const raw = record(value);
  return { id: text(raw.id ?? raw.judge_id ?? raw.user_id), name: text(raw.name ?? raw.full_name ?? raw.email, "Judge"), email: text(raw.email), status: text(raw.status, "Invited"), assignedCount: Number(raw.assigned_count ?? raw.assignedCount ?? 0), completedCount: Number(raw.completed_count ?? raw.completedCount ?? 0) };
}
export function normalizeJudges(value: unknown): JudgeRecord[] { return list(value).map(normalizeJudge); }

export function normalizeCriterion(value: unknown): RubricCriterion {
  const raw = record(value);
  return { id: text(raw.id ?? raw.criterion_id ?? raw.name), name: text(raw.name ?? raw.title, "Criterion"), description: text(raw.description), weight: Number(raw.weight ?? raw.weight_percent ?? 0), maxScore: Number(raw.max_score ?? raw.maxScore ?? 5) };
}
export function normalizeRubric(value: unknown): RubricCriterion[] {
  const raw = record(value);
  return list(Array.isArray(value) ? value : raw.criteria ?? raw.items ?? raw.data).map(normalizeCriterion);
}

export function normalizeAssignment(value: unknown): AssignmentRecord {
  const raw = record(value);
  const projectValue = raw.project ?? raw.submission ?? { ...raw, id: raw.project_id ?? raw.projectId ?? raw.id, title: raw.project_title ?? raw.title };
  const project = normalizeProject(projectValue);
  const rubric = record(raw.rubric);
  return { id: text(raw.id ?? raw.assignment_id ?? `${project.id}-assignment`), project, status: reviewStatus(raw.status ?? raw.review_status), rubricId: text(raw.rubric_id ?? raw.rubricId ?? rubric.id) || undefined, dueAt: text(raw.due_at ?? raw.dueAt) || undefined, submittedAt: text(raw.submitted_at ?? raw.submittedAt) || undefined };
}
export function normalizeAssignments(value: unknown): AssignmentRecord[] { return list(value).map(normalizeAssignment); }

export function normalizeResult(value: unknown): ResultRecord {
  const raw = record(value);
  const project = record(raw.project);
  const numericOrNull = (candidate: unknown): number | null => candidate === null || candidate === undefined || candidate === "" ? null : Number.isFinite(Number(candidate)) ? Number(candidate) : null;
  return {
    projectId: text(raw.project_id ?? raw.projectId ?? project.id),
    projectTitle: text(raw.project_title ?? raw.title ?? project.title, "Project"),
    team: text(raw.team_name ?? raw.team ?? project.team, "—"),
    track: text(raw.track_name ?? raw.track ?? project.track, "—"),
    rank: numericOrNull(raw.rank),
    rawScore: numericOrNull(raw.raw_score ?? raw.rawScore ?? raw.average_score),
    normalizedScore: numericOrNull(raw.normalized_score ?? raw.normalizedScore),
    rankBefore: numericOrNull(raw.rank_before ?? raw.rankBefore),
    rankAfter: numericOrNull(raw.rank_after ?? raw.rankAfter),
    reviewCount: Number(raw.review_count ?? raw.reviewCount ?? 0),
    explanation: text(raw.explanation ?? raw.normalization_explanation) || undefined,
  };
}
export function normalizeResults(value: unknown): ResultRecord[] { return list(value).map(normalizeResult); }

export function normalizeProgress(value: unknown): ReviewProgress {
  const raw = record(value);
  const distribution = list(raw.judge_distribution ?? raw.judgeDistribution).map((item) => {
    const row = record(item);
    return { judgeName: text(row.judge_name ?? row.judgeName, "Judge"), assigned: Number(row.assigned ?? row.assigned_count ?? 0), completed: Number(row.completed ?? row.completed_count ?? 0) };
  });
  const total = Number(raw.total_reviews ?? raw.totalReviews ?? 0);
  const completed = Number(raw.completed_reviews ?? raw.completedReviews ?? 0);
  return {
    totalReviews: total,
    completedReviews: completed,
    pendingReviews: Number(raw.pending_reviews ?? raw.pendingReviews ?? Math.max(0, total - completed)),
    assignedProjects: Number(raw.assigned_projects ?? raw.assignedProjects ?? 0),
    completedProjects: Number(raw.completed_projects ?? raw.completedProjects ?? 0),
    judgeDistribution: distribution,
    scoreVariance: raw.score_variance === null || raw.score_variance === undefined ? null : Number(raw.score_variance),
    normalizationStatus: text(raw.normalization_status ?? raw.normalizationStatus, "Not provided by API"),
  };
}

export function normalizeProjectStatus(value: unknown): ProjectStatus { return projectStatus(value); }
export function normalizeEventStatus(value: unknown): EventStatus { return statusOf(value); }
