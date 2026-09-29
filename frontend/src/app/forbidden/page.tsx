import Link from "next/link";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { StatePanel } from "@/components/ui/StatePanel";

export const metadata: Metadata = { title: "Access not permitted", robots: { index: false, follow: false } };

export default function ForbiddenPage() {
  return <div className="public-page"><PublicHeader /><main className="public-content public-content--detail"><StatePanel variant="error" title="This workspace is not available for your role" description="Sign in with the correct JudgeForge account or ask an organizer to review your permissions."><Link className="button button--quiet" href="/login">Return to sign in</Link></StatePanel></main></div>;
}
