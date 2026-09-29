"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/features/auth/AuthProvider";

export function AuthBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isDesignPreview = pathname === "/preview" || pathname.startsWith("/preview/");

  if (isDesignPreview) return children;
  return <AuthProvider>{children}</AuthProvider>;
}
