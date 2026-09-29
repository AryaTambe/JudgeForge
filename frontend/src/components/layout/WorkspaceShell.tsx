"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { roleLabel } from "@/lib/session/roles";
import type { AppRole, AuthUser } from "@/types/portal";

interface NavItem { href: string; label: string; glyph: string }
const navigation: Record<AppRole, NavItem[]> = {
  participant: [
    { href: "/participant", label: "Overview", glyph: "⌂" },
    { href: "/participant/team", label: "My team", glyph: "◉" },
    { href: "/participant/projects", label: "My projects", glyph: "▤" },
  ],
  judge: [
    { href: "/judge", label: "Overview", glyph: "⌂" },
    { href: "/judge/assignments", label: "Assignments", glyph: "▤" },
  ],
  organizer: [
    { href: "/organizer", label: "Overview", glyph: "⌂" },
    { href: "/organizer/events", label: "Events", glyph: "◷" },
    { href: "/organizer/projects", label: "Projects", glyph: "▤" },
    { href: "/organizer/teams", label: "Teams", glyph: "◉" },
    { href: "/organizer/judges", label: "Judges", glyph: "◎" },
    { href: "/organizer/assignments", label: "Assignments", glyph: "↗" },
    { href: "/organizer/rubric", label: "Rubric", glyph: "≋" },
    { href: "/organizer/results", label: "Results", glyph: "▥" },
    { href: "/organizer/integrity", label: "Judging integrity", glyph: "◈" },
  ],
  admin: [
    { href: "/admin", label: "Overview", glyph: "⌂" },
    { href: "/admin/users", label: "User directory", glyph: "◎" },
    { href: "/admin/events", label: "System events", glyph: "◷" },
  ],
};

const pageNames: Record<string, string> = {
  "/participant": "Student workspace", "/participant/team": "My team", "/participant/team/create": "Create a team", "/participant/team/join": "Join a team", "/participant/projects": "My projects", "/participant/projects/new": "New project", "/participant/projects/edit": "Edit project",
  "/judge": "Judge workspace", "/judge/assignments": "My assignments", "/judge/review": "Project review",
  "/organizer": "Organizer workspace", "/organizer/events": "Events", "/organizer/events/new": "Create event", "/organizer/events/edit": "Edit event", "/organizer/projects": "Projects", "/organizer/teams": "Teams", "/organizer/judges": "Judges", "/organizer/assignments": "Assignments", "/organizer/rubric": "Scoring rubric", "/organizer/results": "Results", "/organizer/integrity": "Judging integrity",
  "/admin": "Admin workspace", "/admin/users": "User directory", "/admin/events": "System events",
};

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "DF";
}

export function WorkspaceShell({ role, user, children }: { role: AppRole; user: AuthUser; children: ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentTitle = pageNames[pathname] ?? navigation[role].find((item) => pathname.startsWith(item.href))?.label ?? roleLabel[role];

  async function signOut() {
    try { await logout(); } catch { /* Local session is cleared even if the API logout endpoint is unavailable. */ } finally { router.replace("/login"); }
  }

  return (
    <div className="workspace-shell">
      <button className={`sidebar-backdrop${mobileOpen ? " is-open" : ""}`} aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
      <aside className={`workspace-sidebar${mobileOpen ? " is-open" : ""}`}>
        <Link className="workspace-brand" href="/" aria-label="DOGFOOD Portal home" onClick={() => setMobileOpen(false)}>
          <Image src="/dogfood-mark.png" alt="" width={34} height={34} priority unoptimized />
          <span><strong>DOGFOOD</strong><small>EVENT OPERATIONS</small></span>
        </Link>
        <div className="sidebar-section-label">CURRENT WORKSPACE</div>
        <div className={`workspace-role workspace-role--${role}`}><span className="role-pip" />{roleLabel[role]}</div>
        <nav className="workspace-nav" aria-label={`${roleLabel[role]} navigation`}>
          <div className="sidebar-section-label">WORKSPACE</div>
          {navigation[role].map((item) => {
            const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(`${item.href}/`));
            return <Link key={item.href} className={`workspace-nav__item${active ? " is-active" : ""}`} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setMobileOpen(false)}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></Link>;
          })}
          {role !== "participant" && role !== "judge" ? <div className="sidebar-divider" /> : null}
          <Link className="workspace-nav__item" href="/projects" onClick={() => setMobileOpen(false)}><span className="nav-glyph" aria-hidden="true">↗</span><span>Public gallery</span></Link>
        </nav>
        <div className="sidebar-event-card"><span className="eyebrow">ACTIVE EVENT</span><strong>DOGFOOD 2026</strong><span>Sep 26–29 · Online</span><span className="sidebar-event-card__status"><i /> Event workspace</span></div>
        <div className="sidebar-account">
          <span className="avatar">{initials(user.name)}</span>
          <span className="sidebar-account__copy"><strong>{user.name}</strong><small>{user.email}</small></span>
          <button type="button" className="icon-button signout-button" onClick={signOut} aria-label="Sign out" title="Sign out">↗</button>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-topbar">
          <button className="mobile-menu-button" type="button" aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>☰</button>
          <div className="workspace-breadcrumb"><span>2026 EVENT</span><b>/</b><strong>{currentTitle}</strong></div>
          <div className="workspace-topbar__right"><span className="api-indicator"><i /> PRIVATE WORKSPACE</span><span className="avatar avatar--small">{initials(user.name)}</span></div>
        </header>
        <main className="workspace-content">{children}</main>
        <footer className="workspace-footer"><span>JudgeForge · DOGFOOD 2026</span><span>API authorization is enforced by the backend.</span></footer>
      </div>
    </div>
  );
}
