"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EventEditor } from "@/features/organizer/EventEditor";
import { StatePanel } from "@/components/ui/StatePanel";

function EditEventContent() {
  const params = useSearchParams();
  return <EventEditor eventId={params.get("id") ?? undefined} />;
}

export default function EditEventRoute() {
  return <Suspense fallback={<StatePanel variant="loading" title="Loading event" description="Reading the event identifier." />}><EditEventContent /></Suspense>;
}
