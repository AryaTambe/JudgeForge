"use client";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />

      <div className="relative hidden w-full max-w-sm md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search projects, teams..."
          className="pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">Arya Tambe</p>
          <p className="text-xs text-muted-foreground">Participant</p>
        </div>
      </div>
    </header>
  );
}