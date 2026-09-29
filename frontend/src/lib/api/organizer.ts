import { sampleProjects } from "@/data/sample-business-data";
import { apiRequest } from "@/lib/api/client";
import { FIXTURE_DATA_ENABLED } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { readFixtureState } from "@/lib/api/fixture-store";
import { normalizeEvents, normalizeProjects, normalizeTrack, normalizePrize } from "@/lib/api/normalizers";
import type { EventRecord, Prize, ProjectRecord, TeamRecord, Track } from "@/types/portal";

function fixture(token: string): boolean {
  if (!FIXTURE_DATA_ENABLED) return false;
  if (!token) throw new Error("A real authenticated account is required before synthetic data can be used.");
  return true;
}

export async function getAllProjects(token: string): Promise<ProjectRecord[]> {
  if (fixture(token)) return readFixtureState().projects.length ? readFixtureState().projects : sampleProjects;
  return normalizeProjects(await apiRequest<unknown>(endpoints.projects.list, { token }));
}

export async function getAllTeams(token: string): Promise<TeamRecord[]> {
  if (fixture(token)) {
    const team = readFixtureState().team;
    return team ? [team] : [];
  }
  throw new Error("The supplied backend API contract does not confirm a collection endpoint for organizer team listing. Add one to the backend/OpenAPI contract before enabling this view.");
}

export async function addEventTrack(token: string, eventId: string, name: string): Promise<Track> {
  if (fixture(token)) return { id: `sample-track-${Date.now()}`, name };
  return normalizeTrack(await apiRequest<unknown>(endpoints.events.tracks(eventId), { method: "POST", token, body: JSON.stringify({ name }) }));
}
export async function updateEventTrack(token: string, trackId: string, name: string): Promise<Track> {
  if (fixture(token)) return { id: trackId, name };
  return normalizeTrack(await apiRequest<unknown>(`/api/events/tracks/${encodeURIComponent(trackId)}`, { method: "PUT", token, body: JSON.stringify({ name }) }));
}
export async function deleteEventTrack(token: string, trackId: string): Promise<void> {
  if (fixture(token)) return;
  return apiRequest<void>(`/api/events/tracks/${encodeURIComponent(trackId)}`, { method: "DELETE", token });
}
export async function addEventPrize(token: string, eventId: string, prize: Omit<Prize, "id">): Promise<Prize> {
  if (fixture(token)) return { id: `sample-prize-${Date.now()}`, ...prize };
  return normalizePrize(await apiRequest<unknown>(endpoints.events.prizes(eventId), { method: "POST", token, body: JSON.stringify({ title: prize.title, description: prize.description, amount: prize.amount, rank: prize.rank }) }));
}
export async function updateEventPrize(token: string, prizeId: string, prize: Omit<Prize, "id">): Promise<Prize> {
  if (fixture(token)) return { id: prizeId, ...prize };
  return normalizePrize(await apiRequest<unknown>(`/api/events/prizes/${encodeURIComponent(prizeId)}`, { method: "PUT", token, body: JSON.stringify({ title: prize.title, description: prize.description, amount: prize.amount, rank: prize.rank }) }));
}
export async function deleteEventPrize(token: string, prizeId: string): Promise<void> {
  if (fixture(token)) return;
  return apiRequest<void>(`/api/events/prizes/${encodeURIComponent(prizeId)}`, { method: "DELETE", token });
}

export async function listEventRecords(token: string): Promise<EventRecord[]> {
  if (fixture(token)) return normalizeEvents([readFixtureState().team ? { id: "sample-event-2026", name: "Sample Hack 2026", description: "Synthetic development fixture", start_date: "2026-02-26T00:00:00Z", end_date: "2026-03-01T23:59:00Z", submission_deadline: "2026-03-01T18:00:00Z", status: "closed", tracks: [], prizes: [] } : {}]);
  return normalizeEvents(await apiRequest<unknown>(endpoints.events.list, { token }));
}
