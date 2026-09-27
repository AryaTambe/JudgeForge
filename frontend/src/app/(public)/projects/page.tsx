"use client";

import {
  ArrowRight,
  FolderKanban,
  GitBranch,
  Search,
  Trophy,
  Users,
} from "lucide-react";

import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const projects = [
  {
    id: "prj_01",
    title: "Glass Signal",
    team: "tm_01",
    track: "trk_04",
    summary: "One line of what it does.",
    repo: "https://example.org/repo/01",
  },
  {
    id: "prj_02",
    title: "Small Meadow",
    team: "tm_02",
    track: "trk_03",
    summary: "One line of what it does.",
    repo: "https://example.org/repo/02",
  },
  {
    id: "prj_03",
    title: "Deep Compass",
    team: "tm_03",
    track: "trk_03",
    summary: "One line of what it does.",
    repo: "https://example.org/repo/03",
  },
  {
    id: "prj_04",
    title: "Green Switch",
    team: "tm_04",
    track: "trk_07",
    summary: "One line of what it does.",
    repo: "https://example.org/repo/04",
  },
  {
    id: "prj_05",
    title: "North Compass",
    team: "tm_05",
    track: "trk_02",
    summary: "One line of what it does.",
    repo: "https://example.org/repo/05",
  },
  {
    id: "prj_06",
    title: "Dry Compass",
    team: "tm_06",
    track: "trk_01",
    summary: "One line of what it does.",
    repo: "https://example.org/repo/06",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4">
                <Trophy className="mr-2 size-3.5" />
                DOGFOOD 2026
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Project Gallery
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Explore projects submitted to DOGFOOD 2026. Browse teams,
                tracks, repositories, and project details.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search projects..."
                  className="pl-9"
                />
              </div>

              <Button variant="outline">
                All tracks
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                DOGFOOD 2026
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Submitted projects
              </h2>
            </div>

            <div className="text-sm text-muted-foreground">
              40+ projects
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <FadeIn
                key={project.id}
                delay={0.08 + index * 0.05}
              >
                <Card className="group h-full border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FolderKanban className="size-5" />
                      </div>

                      <Badge variant="secondary">
                        {project.track}
                      </Badge>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {project.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {project.summary}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="size-4" />
                      <span>{project.team}</span>
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-6">
                      <Button className="flex-1">
                        View project
                        <ArrowRight />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Open ${project.title} repository`}
                        onClick={() => {
                          window.open(
                            project.repo,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        <GitBranch />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}