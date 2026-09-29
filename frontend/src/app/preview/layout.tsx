import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Read-only design previews | DOGFOOD Portal",
  description: "Public, read-only sample views of DOGFOOD portal workspaces.",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return children;
}
