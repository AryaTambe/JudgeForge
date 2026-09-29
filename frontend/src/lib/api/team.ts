import { FIXTURE_DATA_ENABLED } from "@/lib/api/config";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function createTeamInvite(token: string, teamId: string): Promise<string> {
  if (FIXTURE_DATA_ENABLED) return `${window.location.origin}/participant/team/join?token=SAMPLE-ONLY`;
  const response = await apiRequest<unknown>(endpoints.teams.invites(teamId), { method: "POST", token, body: JSON.stringify({}) });
  if (!response || typeof response !== "object") throw new Error("The API did not return an invite link or token.");
  const raw = response as Record<string, unknown>;
  const directUrl = raw.invite_url ?? raw.inviteUrl ?? raw.url;
  if (typeof directUrl === "string" && directUrl.trim()) return directUrl;
  const inviteToken = raw.token ?? raw.invite_token ?? raw.inviteToken;
  if (typeof inviteToken === "string" && inviteToken.trim()) return `${window.location.origin}/participant/team/join?token=${encodeURIComponent(inviteToken)}`;
  throw new Error("The invite response did not contain a usable link or token.");
}
