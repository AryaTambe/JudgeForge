export function StatusBadge({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "mint" | "amber" | "coral" | "blue" }) {
  return <span className={`status-badge status-badge--${tone}`}><i aria-hidden="true" />{children}</span>;
}
