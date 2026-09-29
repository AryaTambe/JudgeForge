"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JudgeReviewPage } from "@/features/judge/JudgePages";
import { StatePanel } from "@/components/ui/StatePanel";

function ReviewContent() {
  const params = useSearchParams();
  return <JudgeReviewPage projectId={params.get("id") ?? ""} />;
}

export default function JudgeReviewRoute() {
  return <Suspense fallback={<StatePanel variant="loading" title="Loading review" description="Reading the project assignment." />}><ReviewContent /></Suspense>;
}
