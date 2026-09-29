import type { Project } from "@/types/project";
import { formatSubmittedAt } from "@/lib/utils/format-date";

interface ProjectCardProps {
  project: Project;
}

function teamSizeLabel(size: number): string {
  return `${size} ${size === 1 ? "member" : "members"}`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card__topline">
        <span className="project-card__id">{project.id}</span>
        <span className="sample-badge"><span aria-hidden="true" /> SAMPLE FIXTURE</span>
      </div>

      <div className="project-card__body">
        <p className="project-card__track">{project.track}</p>
        <h3>{project.title}</h3>
        <p className="project-card__summary">{project.summary}</p>
      </div>

      <dl className="project-card__details">
        <div>
          <dt>Team</dt>
          <dd>{project.team}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>{teamSizeLabel(project.teamSize)}</dd>
        </div>
      </dl>

      <div className="project-card__footer">
        <p>Submitted {formatSubmittedAt(project.submittedAt)}</p>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open sample repository link for ${project.title} in a new tab`}
          title="Placeholder repository URL from the sample fixture data"
        >
          Sample repo <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
