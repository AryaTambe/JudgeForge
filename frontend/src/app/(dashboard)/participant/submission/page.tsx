import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  Send,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const checklist = [
  {
    label: "Project details completed",
    description: "Project name and description are provided.",
    complete: false,
  },
  {
    label: "Repository added",
    description: "A GitHub repository is linked to the project.",
    complete: false,
  },
  {
    label: "Demo link added",
    description: "A working demo URL has been provided.",
    complete: false,
  },
  {
    label: "Team confirmed",
    description: "Your project is associated with a team.",
    complete: false,
  },
];

export default function SubmissionPage() {
  const completedCount = checklist.filter((item) => item.complete).length;
  const totalCount = checklist.length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Participant</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Submission
          </h1>

          <p className="mt-2 text-muted-foreground">
            Review your project before submitting it for judging.
          </p>
        </div>

        <Badge variant="secondary">Draft</Badge>
      </div>

      {/* Submission status */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileCheck2 className="size-5" />
            </div>

            <div>
              <p className="font-semibold">Ready to submit?</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Complete the checklist below before submitting your project.
              </p>
            </div>
          </div>

          <Badge variant="outline">
            {completedCount}/{totalCount} complete
          </Badge>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Checklist</CardTitle>

          <CardDescription>
            Make sure everything required for your project is ready.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                  item.complete
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.complete ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <AlertCircle className="size-4" />
                )}
              </div>

              <div className="min-w-0">
                <p className="font-medium">{item.label}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <Badge
                variant={item.complete ? "secondary" : "outline"}
                className="ml-auto shrink-0"
              >
                {item.complete ? "Complete" : "Required"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Project preview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Preview</CardTitle>

          <CardDescription>
            This is the information that will be associated with your
            submission.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <p className="text-sm font-medium">Project</p>
            <p className="mt-1 text-muted-foreground">No project created</p>
          </div>

          <div>
            <p className="text-sm font-medium">Track</p>
            <p className="mt-1 text-muted-foreground">No track selected</p>
          </div>

          <div>
            <p className="text-sm font-medium">Repository</p>

            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="size-4" />
              No repository linked
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final action */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Submit your project</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Once submitted, your project will be available for judging.
            </p>
          </div>

          <Button disabled className="w-full sm:w-auto">
            <Send />
            Submit Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}