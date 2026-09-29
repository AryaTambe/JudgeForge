"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JoinTeamForm } from "@/features/participant/ParticipantPages";
import { StatePanel } from "@/components/ui/StatePanel";

function JoinTeamContent() {
  const params = useSearchParams();
  return <JoinTeamForm inviteToken={params.get("token") ?? ""} />;
}

export function JoinTeamPage() {
  return <Suspense fallback={<StatePanel variant="loading" title="Loading invitation" description="Reading the invitation token." />}><JoinTeamContent /></Suspense>;
}
