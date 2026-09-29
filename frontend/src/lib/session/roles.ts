import type { AppRole } from "@/types/portal";

export const roleHome: Record<AppRole, string> = {
  participant: "/participant",
  judge: "/judge",
  organizer: "/organizer",
  admin: "/admin",
};

export const roleLabel: Record<AppRole, string> = {
  participant: "Student / Participant",
  judge: "Judge",
  organizer: "Organizer",
  admin: "Admin",
};
