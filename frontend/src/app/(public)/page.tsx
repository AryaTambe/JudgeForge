"use client";

import {
  ArrowRight,
  CalendarDays,
  GitBranch,
  Layers3,
  Search,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { FadeIn } from "@/components/shared/FadeIn";
import { BeamsBackground } from "@/components/ui/beams-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const projects = [
  {
    title: "Project Alpha",
    team: "Team Alpha",
    track: "Open Innovation",
    description:
      "An example hackathon project demonstrating an innovative solution to a real-world problem.",
  },
  {
    title: "Project Beta",
    team: "Team Beta",
    track: "AI & Machine Learning",
    description:
      "A practical application of machine learning designed to solve a challenging problem.",
  },
  {
    title: "Project Gamma",
    team: "Team Gamma",
    track: "Web & Technology",
    description:
      "A modern technology solution built during the DOGFOOD 2026 hackathon.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-neutral-950">
        <BeamsBackground intensity="strong">
          <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <FadeIn>
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <Badge
                  variant="outline"
                  className="mb-6 border-white/20 bg-white/5 px-4 py-1.5 text-white backdrop-blur-sm"
                >
                  <span className="mr-2 size-1.5 rounded-full bg-emerald-400" />
                  DOGFOOD 2026
                </Badge>

                <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  Build.
                  <br />
                  <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                    Ship. Get judged.
                  </span>
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                  The open-source platform for hackathon submissions,
                  judging, teams, and results.
                </p>

                <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                  <Button
                    size="lg"
                    className="h-11 px-6 shadow-lg shadow-primary/20"
                  >
                    Explore projects
                    <ArrowRight />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 border-white/15 bg-white/5 px-6 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                  >
                    Sign in to participate
                  </Button>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/45">
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Open-source
                  </span>

                  <span>Self-hostable</span>

                  <span>Built for hackathons</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </BeamsBackground>
      </section>

      {/* Event stats */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x sm:grid-cols-4">
          <FadeIn delay={0.05}>
            <div className="p-6 sm:p-8">
              <Users className="size-5 text-muted-foreground" />
              <p className="mt-4 text-2xl font-semibold">40+</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="p-6 sm:p-8">
              <Layers3 className="size-5 text-muted-foreground" />
              <p className="mt-4 text-2xl font-semibold">8</p>
              <p className="text-sm text-muted-foreground">Tracks</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="p-6 sm:p-8">
              <Trophy className="size-5 text-muted-foreground" />
              <p className="mt-4 text-2xl font-semibold">Multiple</p>
              <p className="text-sm text-muted-foreground">Prizes</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="p-6 sm:p-8">
              <CalendarDays className="size-5 text-muted-foreground" />
              <p className="mt-4 text-2xl font-semibold">2026</p>
              <p className="text-sm text-muted-foreground">Hackathon</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Public gallery
              </p>

              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                Explore projects
              </h2>

              <p className="mt-2 text-muted-foreground">
                Discover what teams are building at DOGFOOD 2026.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search projects..."
                className="pl-9"
              />
            </div>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <FadeIn key={project.title} delay={0.1 + index * 0.08}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="outline">{project.track}</Badge>

                    <GitBranch className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>

                  <CardTitle className="mt-3">
                    {project.title}
                  </CardTitle>

                  <CardDescription>
                    by {project.team}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex h-full flex-col">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>

                  <Button
                    variant="ghost"
                    className="mt-6 w-fit px-0 hover:bg-transparent"
                  >
                    View project
                    <ArrowRight />
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Event information */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <Card>
              <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="text-sm font-medium text-primary">
                    DOGFOOD 2026
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    Hackathon projects, submissions and judging.
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    JudgeForge provides the submission, judging and event
                    management experience for the hackathon.
                  </p>
                </div>

                <Button variant="outline">
                  Learn more
                  <ArrowRight />
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

     
    </main>
  );
}