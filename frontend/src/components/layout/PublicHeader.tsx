"use client";

import { ArrowRight, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
              JudgeForge
            </p>

            <p className="text-[11px] text-white/45">
              DOGFOOD 2026
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 sm:flex">
          <Button
            variant="ghost"
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            Projects
          </Button>

          <Button
            variant="ghost"
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            About
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            Sign in
          </Button>

          <Button className="hidden sm:inline-flex">
            Participate
            <ArrowRight />
          </Button>
        </div>
      </div>
    </header>
  );
}