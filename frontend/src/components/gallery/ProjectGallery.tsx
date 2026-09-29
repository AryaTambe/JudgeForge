"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/gallery/ProjectCard";
import { StatePanel } from "@/components/ui/StatePanel";
import type { Project, TeamSizeFilter } from "@/types/project";

interface ProjectGalleryProps {
  projects: Project[];
  dataState?: "ready" | "loading" | "error";
}

const INITIAL_VISIBLE = 9;

function teamSizeBucket(size: number): Exclude<TeamSizeFilter, "all"> {
  if (size <= 1) return "solo";
  if (size <= 3) return "small";
  return "large";
}

export function ProjectGallery({ projects, dataState = "ready" }: ProjectGalleryProps) {
  const [query, setQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [teamSize, setTeamSize] = useState<TeamSizeFilter>("all");
  const [expanded, setExpanded] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const tracks = Array.from(new Set(projects.map((project) => project.track))).sort((a, b) => a.localeCompare(b));
  const activeFilters = Boolean(normalizedQuery || selectedTrack || teamSize !== "all");

  const filteredProjects = projects.filter((project) => {
    const searchableText = [
      project.id,
      project.title,
      project.summary,
      project.team,
      project.track,
      project.repoUrl,
    ]
      .join(" ")
      .toLocaleLowerCase();

    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesTrack = !selectedTrack || project.track === selectedTrack;
    const matchesTeamSize = teamSize === "all" || teamSizeBucket(project.teamSize) === teamSize;

    return matchesQuery && matchesTrack && matchesTeamSize;
  });

  const visibleProjects = activeFilters || expanded
    ? filteredProjects
    : filteredProjects.slice(0, INITIAL_VISIBLE);

  function clearFilters() {
    setQuery("");
    setSelectedTrack("");
    setTeamSize("all");
    setExpanded(false);
  }

  return (
    <section className="gallery-section" id="projects" aria-labelledby="projects-title">
      <div className="gallery-heading">
        <div>
          <p className="eyebrow">DISCOVER <span>/ 02</span></p>
          <h2 id="projects-title">Projects in the wild.</h2>
          <p className="gallery-heading__lede">
            Browse the sample set. Search by project, team, track, or submission details.
          </p>
        </div>
        <div className="gallery-heading__count" aria-label={`${projects.length} sample project records`}>
          <span className="gallery-heading__count-value">{projects.length.toString().padStart(2, "0")}</span>
          <span>sample<br />records</span>
        </div>
      </div>

      <aside className="fixture-notice" aria-label="Sample data disclosure">
        <span className="fixture-notice__mark" aria-hidden="true">i</span>
        <p>
          <strong>Fixture preview — not live DOGFOOD submissions.</strong> These synthetic records come from the shared <em>Sample Hack 2026</em> dataset: 41 records, 40 teams, and 8 tracks, including one duplicate submission. Repository links are placeholders.
        </p>
      </aside>

      <div className="gallery-toolbar" aria-label="Project search and filters">
        <label className="search-field">
          <span className="sr-only">Search sample projects</span>
          <span className="search-field__icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setExpanded(false);
            }}
            placeholder="Search projects, teams, tracks…"
            autoComplete="off"
            aria-describedby="project-result-count"
          />
          {query ? (
            <button className="search-field__clear" type="button" onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          ) : null}
        </label>

        <label className="filter-field">
          <span>Track</span>
          <select value={selectedTrack} onChange={(event) => setSelectedTrack(event.target.value)}>
            <option value="">All tracks</option>
            {tracks.map((track) => <option key={track} value={track}>{track}</option>)}
          </select>
        </label>

        <label className="filter-field filter-field--size">
          <span>Team size</span>
          <select value={teamSize} onChange={(event) => setTeamSize(event.target.value as TeamSizeFilter)}>
            <option value="all">Any size</option>
            <option value="solo">Solo</option>
            <option value="small">2–3 members</option>
            <option value="large">4+ members</option>
          </select>
        </label>

        <button className="reset-button" type="button" onClick={clearFilters} disabled={!activeFilters}>
          Reset <span aria-hidden="true">↺</span>
        </button>
      </div>

      <div className="results-bar">
        <p id="project-result-count" aria-live="polite" aria-atomic="true">
          <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? "result" : "results"}
          {activeFilters ? " matching your search" : " in the sample gallery"}
        </p>
        <span className="results-bar__source">LOCAL FIXTURES <span aria-hidden="true">·</span> NO API CONNECTED</span>
      </div>

      <div className="results-region" id="project-results" aria-busy={dataState === "loading"}>
        {dataState === "loading" ? (
          <StatePanel variant="loading" title="Loading project fixtures" description="Gathering the sample submissions for this gallery." />
        ) : dataState === "error" ? (
          <StatePanel variant="error" title="Projects are unavailable" description="The gallery could not be loaded. Try again in a moment." />
        ) : projects.length === 0 ? (
          <StatePanel variant="empty" title="No projects yet" description="The gallery is ready for submissions as soon as project data is connected." />
        ) : filteredProjects.length === 0 ? (
          <StatePanel
            variant="no-results"
            title="No projects match those filters"
            description="Try a broader keyword or clear the current track and team-size filters."
            actionLabel="Reset search and filters"
            onAction={clearFilters}
          />
        ) : (
          <>
            <div className="project-grid" aria-label="Sample project results">
              {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
            {!activeFilters && filteredProjects.length > INITIAL_VISIBLE ? (
              <div className="gallery-more">
                <p>Showing {visibleProjects.length} of {filteredProjects.length} sample project records.</p>
                <button className="button button--outline" type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded} aria-controls="project-results">
                  {expanded ? "Show less" : `View all ${filteredProjects.length} projects`}
                  <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
