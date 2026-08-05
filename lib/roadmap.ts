import type { Initiative, Project, RoadmapSnapshot } from "@/lib/types";

export const APP_TIMEZONE = process.env.COMPANY_TIMEZONE || "America/New_York";

export function quarterFromDate(date: string | null): string | null {
  if (!date) return null;
  const [year, month] = date.split("-").map(Number);
  if (!year || !month) return null;
  return `Q${Math.ceil(month / 3)} ${year}`;
}

export function currentQuarter(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: APP_TIMEZONE, year: "numeric", month: "numeric" }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  return `Q${Math.ceil(month / 3)} ${year}`;
}

export function quarterIndex(quarter: string): number {
  const match = /^Q([1-4]) (\d{4})$/.exec(quarter);
  return match ? Number(match[2]) * 4 + Number(match[1]) - 1 : 0;
}

export function shiftQuarter(quarter: string, delta: number): string {
  const index = quarterIndex(quarter) + delta;
  return `Q${(index % 4) + 1} ${Math.floor(index / 4)}`;
}

export function visibleInitiatives(initiatives: Initiative[], quarter: string) {
  const current = quarterIndex(currentQuarter());
  const selected = quarterIndex(quarter);
  return initiatives.filter((item) => {
    if (item.status === "Canceled" || quarterFromDate(item.targetDate) !== quarter) return false;
    if (selected < current) return item.status === "Completed" || item.status === "Active" || item.status === "Planned";
    return item.status === "Active" || item.status === "Planned" || item.status === "Completed";
  });
}

export function qualifyingProjects(projects: Project[], visibleGoalIds: Set<string>) {
  return projects.filter((project) => {
    const unfinished = !["completed", "canceled"].includes(project.statusType);
    const productOwned = project.teamNames.includes("Product");
    const goalLinked = project.initiativeIds.some((id) => visibleGoalIds.has(id));
    return unfinished && (productOwned || goalLinked);
  });
}

export function groupForStatus(type: string, name: string) {
  const normalized = `${type} ${name}`.toLowerCase();
  if (normalized.includes("started") || normalized.includes("progress") || normalized.includes("build")) return "Building";
  if (normalized.includes("rollout") || normalized.includes("launch") || normalized.includes("maintenance")) return "Rolling out";
  if (normalized.includes("completed") || normalized.includes("shipped")) return "Recently shipped";
  return "Shaping";
}

export function sanitizePlainText(value: unknown, max = 1200): string | null {
  if (typeof value !== "string") return null;
  const clean = value.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/<[^>]+>/g, "").replace(/[`*_>#]/g, "").replace(/\s+/g, " ").trim();
  return clean ? clean.slice(0, max) : null;
}

export function getGoalProjects(goal: Initiative, projects: Project[]) {
  return projects.filter((project) => project.initiativeIds.includes(goal.id));
}

export function snapshotQuarter(snapshot: RoadmapSnapshot, quarter: string) {
  const goals = visibleInitiatives(snapshot.initiatives, quarter);
  const goalIds = new Set(goals.map((goal) => goal.id));
  const projects = qualifyingProjects(snapshot.projects, goalIds);
  return { goals, projects, unlinked: projects.filter((project) => !project.initiativeIds.some((id) => goalIds.has(id))) };
}
