export type Health = "onTrack" | "atRisk" | "offTrack" | null;
export type StatusUpdate = { id: string; body: string; createdAt: string; health: Health };

export type Milestone = { id: string; name: string; description: string | null; targetDate: string | null };
export type Project = {
  id: string; name: string; summary: string | null; status: string; statusType: string;
  health: Health; lead: string | null; startDate: string | null; targetDate: string | null;
  initiativeIds: string[]; teamNames: string[]; milestones: Milestone[];
  latestUpdate: string | null; latestUpdateAt: string | null; statusUpdates: StatusUpdate[];
};
export type Initiative = {
  id: string; name: string; summary: string | null; status: string; health: Health;
  owner: string | null; targetDate: string | null; latestUpdate: string | null; latestUpdateAt: string | null; statusUpdates: StatusUpdate[];
};
export type RoadmapSnapshot = { initiatives: Initiative[]; projects: Project[]; syncedAt: string | null; source: "linear" | "preview" };
