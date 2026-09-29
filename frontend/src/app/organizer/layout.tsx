import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RoleGate } from "@/features/auth/RoleGate";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return <RoleGate role="organizer">{children}</RoleGate>;
}
