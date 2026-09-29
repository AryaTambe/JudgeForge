"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { useAuth } from "@/features/auth/AuthProvider";
import { roleHome } from "@/lib/session/roles";
import type { AppRole } from "@/types/portal";
import { StatePanel } from "@/components/ui/StatePanel";

export function RoleGate({ role, children }: { role: AppRole; children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "anonymous") router.replace(`/login?next=${encodeURIComponent(pathname || roleHome[role])}`);
    else if (status === "authenticated" && user && user.role !== role) router.replace("/forbidden");
  }, [status, user, role, router, pathname]);

  if (status === "loading" || (status === "authenticated" && user?.role !== role)) {
    return <main className="gate-wrap"><StatePanel variant="loading" title="Checking your access" description="Resolving the current JudgeForge session and role." /></main>;
  }
  if (status !== "authenticated" || !user) return <main className="gate-wrap"><StatePanel variant="loading" title="Taking you to sign in" description="A valid session is required for this workspace." /></main>;
  return <WorkspaceShell role={role} user={user}>{children}</WorkspaceShell>;
}
