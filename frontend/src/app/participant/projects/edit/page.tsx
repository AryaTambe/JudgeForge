"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectEditor } from "@/features/participant/ProjectEditor";
import { StatePanel } from "@/components/ui/StatePanel";

function ProjectEditContent() {
  const params = useSearchParams();
  return <ProjectEditor projectId={params.get("id") ?? undefined} />;
}

export default function EditProjectRoute() {
  return <Suspense fallback={<StatePanel variant="loading" title="Loading project" description="Reading the project link." />}><ProjectEditContent /></Suspense>;
}
