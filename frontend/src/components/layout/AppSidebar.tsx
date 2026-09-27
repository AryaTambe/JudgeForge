"use client";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileCheck2,
  ClipboardCheck,
  ChartNoAxesCombined,
  Gavel,
  Trophy,
  ShieldCheck,
  Settings,
  CalendarDays,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type UserRole = "participant" | "judge" | "organizer";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

const navigation: Record<UserRole, NavItem[]> = {
  participant: [
    {
      title: "Dashboard",
      url: "/participant",
      icon: LayoutDashboard,
    },
    {
      title: "My Team",
      url: "/participant/team",
      icon: Users,
    },
    {
      title: "My Project",
      url: "/participant/project",
      icon: FolderKanban,
    },
    {
      title: "Submission",
      url: "/participant/submission",
      icon: FileCheck2,
    },
  ],

  judge: [
    {
      title: "Dashboard",
      url: "/judge",
      icon: LayoutDashboard,
    },
    {
      title: "Assigned Projects",
      url: "/judge/projects",
      icon: FolderKanban,
    },
    {
      title: "Reviews",
      url: "/judge/reviews",
      icon: ClipboardCheck,
    },
    {
      title: "Progress",
      url: "/judge/progress",
      icon: ChartNoAxesCombined,
    },
  ],

  organizer: [
    {
      title: "Overview",
      url: "/organizer",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "/organizer/projects",
      icon: FolderKanban,
    },
    {
      title: "Teams",
      url: "/organizer/teams",
      icon: Users,
    },
    {
      title: "Judges",
      url: "/organizer/judges",
      icon: Gavel,
    },
    {
      title: "Rubric",
      url: "/organizer/rubric",
      icon: ClipboardCheck,
    },
    {
      title: "Results",
      url: "/organizer/results",
      icon: Trophy,
    },
    {
      title: "Integrity",
      url: "/organizer/integrity",
      icon: ShieldCheck,
    },
  ],
};

export function AppSidebar({
  role = "participant",
}: {
  role?: UserRole;
}) {
  const items = navigation[role];

  return (
    <Sidebar>
      <SidebarContent>
        {/* Brand */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-lg font-semibold">
            JudgeForge
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Event"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  <CalendarDays />
                  <span>DOGFOOD 2026</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "participant"
              ? "Participant"
              : role === "judge"
                ? "Judge"
                : "Organizer"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => {
                      window.location.href = item.url;
                    }}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => {
                window.location.href = "/settings";
              }}
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}