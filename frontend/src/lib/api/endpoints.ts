const enc = (id: string | number) => encodeURIComponent(String(id));

export const endpoints = {
  auth: {
    login: "/api/auth/login",
    // Assumed route; the supplied backend walkthrough did not document registration.
    register: "/api/auth/register",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
  },
  events: {
    list: "/api/events",
    detail: (id: string | number) => `/api/events/${enc(id)}`,
    create: "/api/events",
    update: (id: string | number) => `/api/events/${enc(id)}`,
    tracks: (eventId: string | number) => `/api/events/${enc(eventId)}/tracks`,
    prizes: (eventId: string | number) => `/api/events/${enc(eventId)}/prizes`,
  },
  teams: {
    mine: "/api/teams/my",
    detail: (id: string | number) => `/api/teams/${enc(id)}`,
    create: "/api/teams",
    invites: (id: string | number) => `/api/teams/${enc(id)}/invites`,
    join: "/api/teams/join",
  },
  projects: {
    list: "/api/projects",
    mine: "/api/projects/mine",
    detail: (id: string | number) => `/api/projects/${enc(id)}`,
    create: "/api/projects",
    update: (id: string | number) => `/api/projects/${enc(id)}`,
    submit: (id: string | number) => `/api/projects/${enc(id)}/submit`,
  },
  judges: {
    list: "/api/judges",
    invite: "/api/judges/invitations",
    acceptInvite: "/api/judges/accept-invite",
    assign: "/api/judges/assign",
    assignments: "/api/judges/assignments",
  },
  judging: {
    rubric: "/api/rubrics",
    rubricDetail: (id: string | number) => `/api/rubrics/${enc(id)}`,
    scores: "/api/judge/scores",
    progress: "/api/judge/progress",
  },
  results: {
    list: "/api/results",
    project: (id: string | number) => `/api/results/${enc(id)}`,
    csv: "/api/export.csv",
  },
} as const;
