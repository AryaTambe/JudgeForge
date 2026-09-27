import { GitBranch, Zap } from "lucide-react";
export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">JudgeForge</p>
              <p className="text-xs text-white/45">
                DOGFOOD 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm text-white/50">
            <span>Open-source</span>
            <span>Self-hostable</span>

            <a
              href="https://github.com/AryaTambe/JudgeForge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <GitBranch className="size-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/35">
          JudgeForge · DOGFOOD 2026
        </div>
      </div>
    </footer>
  );
}