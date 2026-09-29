"use client";

import { useEffect } from "react";
import { StatePanel } from "@/components/ui/StatePanel";

interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function RouteError({ error, retry }: RouteErrorProps) {
  useEffect(() => {
    console.error("DOGFOOD public route error", error);
  }, [error]);

  return (
    <main className="error-screen page-frame">
      <StatePanel
        variant="error"
        title="This page hit a snag."
        description="The public event preview could not finish rendering. Try the section again."
        actionLabel="Try again"
        onAction={retry}
      />
    </main>
  );
}
