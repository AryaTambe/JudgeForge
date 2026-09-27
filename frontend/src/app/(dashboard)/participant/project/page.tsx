import {
  ExternalLink,
  FileText,
  GitBranch,
  Globe,
  Save,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Participant</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            My Project
          </h1>

          <p className="mt-2 text-muted-foreground">
            Add your project details, links, and submission information.
          </p>
        </div>

        <Badge variant="secondary">Draft</Badge>
      </div>

      {/* Basic information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Tell judges what your project is about.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="Enter your project name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="Describe your project in one sentence"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Explain what your project does, the problem it solves, and how it works..."
              className="min-h-32 resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Project Links</CardTitle>
          <CardDescription>
            Provide links judges can use to explore your project.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub repository</Label>

            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="github"
                placeholder="https://github.com/username/project"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo">Live demo</Label>

            <div className="relative">
              <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="demo"
                placeholder="https://your-project.example.com"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Demo video</Label>

            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="video"
                placeholder="https://youtube.com/..."
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Give judges more context about your implementation.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies used</Label>

            <Input
              id="technologies"
              placeholder="Next.js, TypeScript, PostgreSQL..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional notes</Label>

            <Textarea
              id="notes"
              placeholder="Anything else judges should know?"
              className="min-h-28 resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 size-5 text-muted-foreground" />

            <div>
              <p className="font-medium">Submission status</p>
              <p className="text-sm text-muted-foreground">
                Your project is currently saved as a draft.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline">
              <Save />
              Save Draft
            </Button>

            <Button>
              <Send />
              Submit Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}