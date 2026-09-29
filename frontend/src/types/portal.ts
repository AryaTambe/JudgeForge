export type AppRole = "participant" | "judge" | "organizer" | "admin";
export type LoadState = "loading" | "ready" | "empty" | "error";
export type EventStatus = "upcoming" | "open" | "closed" | "unknown";
export type ProjectStatus = "draft" | "submitted" | "closed" | "unknown";
export type ReviewStatus = "pending" | "in_progress" | "completed" | "unknown";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

export interface Track { id: string; name: string }
export interface Prize { id: string; title: string; description: string; amount?: number; rank?: number }
export interface EventRecord {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  rubricId?: string;
  status: EventStatus;
  tracks: Track[];
  prizes: Prize[];
}
export interface TeamMember { id: string; name: string; email?: string }
export interface TeamRecord {
  id: string;
  name: string;
  status: string;
  eventId?: string;
  members: TeamMember[];
  inviteUrl?: string;
}
export interface ProjectRecord {
  id: string;
  title: string;
  summary: string;
  description: string;
  track: string;
  team: string;
  teamSize: number;
  repositoryUrl: string;
  demoUrl: string;
  submittedAt: string;
  status: ProjectStatus;
}
export interface JudgeRecord {
  id: string;
  name: string;
  email: string;
  status: string;
  assignedCount: number;
  completedCount: number;
}
export interface RubricCriterion { id: string; name: string; description: string; weight: number; maxScore: number }
export interface AssignmentRecord {
  id: string;
  project: ProjectRecord;
  status: ReviewStatus;
  rubricId?: string;
  dueAt?: string;
  submittedAt?: string;
}
export interface ScoreRecord { id: string; projectId: string; criterionId: string; score: number; comment: string }
export interface ResultRecord {
  projectId: string;
  projectTitle: string;
  team: string;
  track: string;
  rank: number | null;
  rawScore: number | null;
  normalizedScore: number | null;
  rankBefore: number | null;
  rankAfter: number | null;
  reviewCount: number;
  explanation?: string;
}
export interface ReviewProgress {
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  assignedProjects: number;
  completedProjects: number;
  judgeDistribution: Array<{ judgeName: string; assigned: number; completed: number }>;
  scoreVariance: number | null;
  normalizationStatus: string;
}
