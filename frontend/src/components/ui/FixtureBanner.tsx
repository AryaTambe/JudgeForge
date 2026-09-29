import { FIXTURE_DATA_ENABLED } from "@/lib/api/config";
import { Notice } from "@/components/ui/Notice";

export function FixtureBanner() {
  if (!FIXTURE_DATA_ENABLED) return null;
  return <Notice tone="amber" title="Synthetic sample data is enabled">These business records are illustrative development fixtures. You are still signed in with a real JudgeForge account; fixtures do not create an identity or bypass role checks, and fixture actions are not persisted to the backend.</Notice>;
}
