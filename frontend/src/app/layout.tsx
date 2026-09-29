import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthBoundary } from "@/features/auth/AuthBoundary";
import "./globals.css";
import "./workspace.css";

const title = "DOGFOOD 2026 | Submission & Judging Portal";
const description = "A self-hostable hackathon submission and judging portal for participants, judges, organizers, and admins.";

export const metadata: Metadata = {
  title: { default: title, template: "%s | DOGFOOD Portal" },
  description,
  keywords: ["DOGFOOD 2026", "hackathon portal", "judging", "project gallery"],
  robots: { index: true, follow: true },
  openGraph: { type: "website", title, description, siteName: "DOGFOOD Portal" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><AuthBoundary>{children}</AuthBoundary></body></html>;
}
