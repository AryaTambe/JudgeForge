"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Users,
} from "lucide-react";

import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    label: "Team",
    value: "Not joined",
    description: "Join or create a team",
    icon: Users,
  },
  {
    label: "Project",
    value: "No project",
    description: "Create your project",
    icon: FolderKanban,
  },
  {
    label: "Submission",
    value: "Draft",
    description: "Not submitted yet",
    icon: CheckCircle2,
  },
];

export default function ParticipantDashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Participant</p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Welcome back, Arya.
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage your team, project, and hackathon submission.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Event is open
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-md">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock3 className="size-5" />
              </div>

              <div>
                <p className="font-medium">Submission deadline</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  March 1, 2026 at 6:00 PM UTC
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full transition-transform duration-200 hover:translate-x-0.5 sm:w-auto"
            >
              View event
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <FadeIn key={stat.label} delay={0.14 + index * 0.07}>
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>

                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.36}>
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>

            <CardDescription>
              Complete these steps before the submission deadline.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex flex-col gap-3 rounded-lg border p-4 transition-colors duration-200 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />

                <div>
                  <p className="font-medium">Join or create a team</p>

                  <p className="text-sm text-muted-foreground">
                    Work together with your teammates.
                  </p>
                </div>
              </div>

              <Button variant="ghost">
                Start
                <ArrowRight />
              </Button>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border p-4 transition-colors duration-200 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <FolderKanban className="size-5 text-muted-foreground" />

                <div>
                  <p className="font-medium">Create your project</p>

                  <p className="text-sm text-muted-foreground">
                    Add your project details and links.
                  </p>
                </div>
              </div>

              <Button variant="ghost">
                Start
                <ArrowRight />
              </Button>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border p-4 transition-colors duration-200 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-muted-foreground" />

                <div>
                  <p className="font-medium">Submit your project</p>

                  <p className="text-sm text-muted-foreground">
                    Review everything before submitting.
                  </p>
                </div>
              </div>

              <Button variant="ghost" disabled>
                Submit
                <ArrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.44}>
        <Card className="transition-shadow duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5" />
              DOGFOOD 2026
            </CardTitle>

            <CardDescription>
              Your current hackathon event.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Build your project, submit it before the deadline, and track its
              judging progress from your dashboard.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}