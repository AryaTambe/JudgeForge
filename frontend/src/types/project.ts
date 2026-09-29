export interface Project {
  id: string;
  title: string;
  summary: string;
  team: string;
  teamSize: number;
  track: string;
  repoUrl: string;
  submittedAt: string;
  status: "Fixture";
}

export type TeamSizeFilter = "all" | "solo" | "small" | "large";
