export function ProgressBar({ value, max, label, showPercent = true }: { value: number; max: number; label: string; showPercent?: boolean }) {
  const safeMax = Math.max(1, max);
  const safeValue = Math.min(safeMax, Math.max(0, value));
  const percent = Math.round((safeValue / safeMax) * 100);
  return <div className="progress-block"><div className="progress-block__label"><span>{label}</span><strong>{showPercent ? `${percent}%` : `${safeValue} / ${safeMax}`}</strong></div><progress className="progress-track" value={safeValue} max={safeMax} aria-label={label}>{percent}%</progress></div>;
}
