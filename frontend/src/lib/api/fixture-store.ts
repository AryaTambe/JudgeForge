import { sampleProjects, sampleTeam } from "@/data/sample-business-data";
import { readSession } from "@/lib/session/session-storage";
import type { ProjectRecord, TeamRecord } from "@/types/portal";

interface FixtureState { projects: ProjectRecord[]; team: TeamRecord | null }

function storageKey(): string {
  const session = readSession();
  if (!session?.user.id) throw new Error("A real authenticated account is required for fixture storage.");
  return `judgeforge.fixture-data.v1.${session.user.id}`;
}

export function readFixtureState(): FixtureState {
  const key = storageKey();
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return { projects: sampleProjects, team: sampleTeam };
    const value = JSON.parse(raw) as Partial<FixtureState>;
    return { projects: Array.isArray(value.projects) ? value.projects : sampleProjects, team: value.team ?? sampleTeam };
  } catch {
    return { projects: sampleProjects, team: sampleTeam };
  }
}

function writeFixtureState(state: FixtureState): void {
  window.sessionStorage.setItem(storageKey(), JSON.stringify(state));
}

export function saveFixtureTeam(team: TeamRecord): TeamRecord {
  const state = readFixtureState();
  writeFixtureState({ ...state, team });
  return team;
}

export function saveFixtureProject(project: ProjectRecord): ProjectRecord {
  const state = readFixtureState();
  const existing = state.projects.findIndex((item) => item.id === project.id);
  const projects = [...state.projects];
  if (existing >= 0) projects[existing] = project;
  else projects.unshift(project);
  writeFixtureState({ ...state, projects });
  return project;
}
