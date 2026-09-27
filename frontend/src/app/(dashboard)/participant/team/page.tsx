"use client";

import {
  ArrowRight,
  Copy,
  Link2,
  MailPlus,
  Plus,
  UserPlus,
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
import { Input } from "@/components/ui/input";

const members = [
  {
    name: "Arya Tambe",
    email: "arya@example.com",
    role: "Team Leader",
  },
];

export default function TeamPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Participant</p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              My Team
            </h1>

            <p className="mt-2 text-muted-foreground">
              Create your team or invite teammates to join.
            </p>
          </div>

          <Button className="w-full sm:w-auto">
            <Plus />
            Create Team
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card className="transition-shadow duration-300 hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Team not created</CardTitle>

                <CardDescription className="mt-1">
                  You haven't joined a team yet.
                </CardDescription>
              </div>

              <Badge variant="secondary">No team</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center transition-colors duration-300 hover:bg-muted/30">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-6" />
              </div>

              <h2 className="mt-4 font-semibold">Start your team</h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Create a team and invite your teammates before submitting
                your project.
              </p>

              <Button className="mt-5">
                <Plus />
                Create Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.16}>
        <Card>
          <CardHeader>
            <CardTitle>Invite teammates</CardTitle>

            <CardDescription>
              Share an invite link with people you want on your team.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                readOnly
                value="Create a team to generate an invite link"
              />

              <Button variant="outline" disabled>
                <Copy />
                Copy
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" disabled>
                <Link2 />
                Invite Link
              </Button>

              <Button variant="outline" disabled>
                <MailPlus />
                Invite by Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.24}>
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>

            <CardDescription>
              People currently belonging to your team.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {members.map((member) => (
              <div
                key={member.email}
                className="flex flex-col gap-3 rounded-lg border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {member.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>

                  <div>
                    <p className="font-medium">{member.name}</p>

                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>

                <Badge variant="outline">{member.role}</Badge>
              </div>
            ))}

            <Button variant="outline" className="w-full">
              <UserPlus />
              Add Teammate
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}