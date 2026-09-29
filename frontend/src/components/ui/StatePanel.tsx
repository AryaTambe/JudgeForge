import type { ReactNode } from "react";

type StateVariant = "loading" | "empty" | "error" | "no-results";

interface StatePanelProps {
  variant: StateVariant;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

const stateLabels: Record<StateVariant, string> = {
  loading: "Loading",
  empty: "No data",
  error: "Something went wrong",
  "no-results": "No matches",
};

export function StatePanel({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: StatePanelProps) {
  const isError = variant === "error";

  return (
    <div
      className={`state-panel state-panel--${variant}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <span className="state-panel__mark" aria-hidden="true">
        {variant === "loading" ? <span className="loading-mark" /> : variant === "error" ? "!" : "0"}
      </span>
      <div className="state-panel__copy">
        <p className="eyebrow state-panel__eyebrow">{stateLabels[variant]}</p>
        <h3>{title}</h3>
        <p>{description}</p>
        {children}
        {actionLabel && onAction ? (
          <button className="text-action" type="button" onClick={onAction}>
            {actionLabel}
            <span aria-hidden="true">→</span>
          </button>
        ) : null}
      </div>
      {variant === "loading" ? (
        <div className="state-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      ) : null}
    </div>
  );
}
