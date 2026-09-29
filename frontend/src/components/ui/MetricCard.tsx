export function MetricCard({ label, value, note, accent = "blue" }: { label: string; value: string | number; note?: string; accent?: "blue" | "mint" | "amber" | "coral" }) {
  return <article className={`metric-card metric-card--${accent}`}><span className="metric-card__label">{label}</span><strong className="metric-card__value">{value}</strong>{note ? <span className="metric-card__note">{note}</span> : null}</article>;
}
