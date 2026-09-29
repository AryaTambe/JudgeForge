import type { Metadata } from "next";
import { PublicProjectsPage } from "@/features/public/PublicPages";

export const metadata: Metadata = { title: "Project Gallery", description: "Search and filter the public Sample Hack 2026 project gallery." };

export default function ProjectsPage() {
  return <PublicProjectsPage />;
}
