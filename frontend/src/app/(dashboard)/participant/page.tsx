export default function ParticipantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Participant Dashboard
        </h1>

        <p className="text-muted-foreground">
          Manage your team, project, and submission.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Team</p>
          <p className="mt-2 text-lg font-semibold">Not joined</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Project</p>
          <p className="mt-2 text-lg font-semibold">No project</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Submission</p>
          <p className="mt-2 text-lg font-semibold">Draft</p>
        </div>
      </div>
    </div>
  );
}