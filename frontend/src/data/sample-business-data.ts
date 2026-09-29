import projectsFixture from "@/data/project-fixtures.json";
import type { AssignmentRecord, EventRecord, JudgeRecord, ProjectRecord, ResultRecord, ReviewProgress, RubricCriterion, TeamRecord } from "@/types/portal";

const fixtureTracks = [...new Set(projectsFixture.map((project) => project.track))];
export const sampleEvent: EventRecord = {
  id: "sample-event-2026",
  name: "Sample Hack 2026",
  description: "Synthetic event data for developing and previewing role workspace screens. This is not the DOGFOOD event and is not connected to a live backend.",
  startDate: "2026-02-26T00:00:00Z",
  endDate: "2026-03-01T23:59:00Z",
  submissionDeadline: "2026-03-01T18:00:00Z",
  status: "closed",
  tracks: fixtureTracks.map((name, index) => ({ id: `sample-track-${index + 1}`, name })),
  prizes: [],
};

export const sampleTeam: TeamRecord = {
  id: "sample-team-01",
  name: "Paper Kites",
  status: "Active",
  eventId: sampleEvent.id,
  members: [
    { id: "sample-user-01", name: "Alex R." },
    { id: "sample-user-02", name: "Sam K." },
    { id: "sample-user-03", name: "Taylor M." },
  ],
  inviteUrl: "/participant/team/join?token=SAMPLE-ONLY",
};

export const sampleProjects: ProjectRecord[] = projectsFixture.slice(0, 12).map((item) => ({
  id: item.id,
  title: item.title,
  summary: item.summary,
  description: item.summary,
  track: item.track,
  team: item.team,
  teamSize: item.teamSize,
  repositoryUrl: item.repoUrl,
  demoUrl: "",
  submittedAt: item.submittedAt,
  status: "submitted",
}));

export const sampleJudges: JudgeRecord[] = Array.from({ length: 10 }, (_, index) => ({
  id: `sample-judge-${index + 1}`,
  name: `Sample Judge ${String(index + 1).padStart(2, "0")}`,
  email: `judge-${String(index + 1).padStart(2, "0")}@example.test`,
  status: index < 8 ? "Active" : "Invited",
  assignedCount: 16,
  completedCount: index < 8 ? 12 : 8,
}));

export interface SampleUserRecord { id: string; name: string; email: string; role: string; status: string }
export const sampleUsers: SampleUserRecord[] = [
  { id: "sample-user-student", name: "Alex R.", email: "alex@example.test", role: "Student", status: "Sample" },
  { id: "sample-user-judge", name: "Sample Judge 01", email: "judge-01@example.test", role: "Judge", status: "Sample" },
  { id: "sample-user-organizer", name: "Riley O.", email: "organizer@example.test", role: "Organizer", status: "Sample" },
  { id: "sample-user-admin", name: "Morgan A.", email: "admin@example.test", role: "Admin", status: "Sample" },
];

export const sampleAssignments: AssignmentRecord[] = sampleProjects.map((project, index) => ({
  id: `sample-assignment-${index + 1}`,
  project,
  status: index < 8 ? "completed" : "pending",
}));

export const sampleRubric: RubricCriterion[] = [
  { id: "innovation", name: "Innovation", description: "Originality and clarity of the approach.", weight: 25, maxScore: 5 },
  { id: "technical", name: "Technical Quality", description: "Engineering quality, reliability, and execution.", weight: 30, maxScore: 5 },
  { id: "impact", name: "Impact", description: "Potential value for hackathon organizers and participants.", weight: 20, maxScore: 5 },
  { id: "ux", name: "UX", description: "Usability, accessibility, and workflow clarity.", weight: 10, maxScore: 5 },
  { id: "presentation", name: "Presentation", description: "Quality of explanation and demonstration.", weight: 15, maxScore: 5 },
];

export const sampleProgress: ReviewProgress = {
  totalReviews: 160,
  completedReviews: 120,
  pendingReviews: 40,
  assignedProjects: 12,
  completedProjects: 8,
  judgeDistribution: sampleJudges.map((judge) => ({ judgeName: judge.name, assigned: judge.assignedCount, completed: judge.completedCount })),
  scoreVariance: null,
  normalizationStatus: "Not available in the supplied sample dataset",
};

// These three values are examples explicitly supplied in the user's UI brief, not backend results.
export const sampleResults: ResultRecord[] = [
  { projectId: "example-a", projectTitle: "Project A", team: "Example team", track: "Example track", rank: 1, rawScore: 4.72, normalizedScore: null, rankBefore: null, rankAfter: null, reviewCount: 4 },
  { projectId: "example-b", projectTitle: "Project B", team: "Example team", track: "Example track", rank: 2, rawScore: 4.61, normalizedScore: null, rankBefore: null, rankAfter: null, reviewCount: 4 },
  { projectId: "example-c", projectTitle: "Project C", team: "Example team", track: "Example track", rank: 3, rawScore: 4.54, normalizedScore: null, rankBefore: null, rankAfter: null, reviewCount: 4 },
];
