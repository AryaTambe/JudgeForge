import type { Metadata } from "next";
import { PublicProjectDetailPage } from "@/features/public/PublicPages";

export const metadata: Metadata = { title: "Project Details", robots: { index: false, follow: false } };

export default function ProjectViewPage() {
  return <PublicProjectDetailPage />;
}
