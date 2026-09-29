import type { ReactNode } from "react";

export function Notice({ tone = "quiet", title, children }: { tone?: "quiet" | "amber" | "coral" | "mint"; title: string; children: ReactNode }) {
  return <div className={`notice notice--${tone}`} role={tone === "coral" ? "alert" : "note"}><strong>{title}</strong><span>{children}</span></div>;
}
