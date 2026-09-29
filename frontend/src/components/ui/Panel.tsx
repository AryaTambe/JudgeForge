import type { ReactNode } from "react";

export function Panel({ title, description, action, children, className = "" }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>
    {title || description || action ? <div className="panel__heading"><div>{title ? <h2>{title}</h2> : null}{description ? <p>{description}</p> : null}</div>{action ? <div className="panel__action">{action}</div> : null}</div> : null}
    {children}
  </section>;
}
