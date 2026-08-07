import { currentQuarter, shiftQuarter, visibleInitiatives, visibleProjectsForBoard } from "@/lib/roadmap";
import type { RoadmapSnapshot } from "@/lib/types";

export function publicRoadmapSnapshot(snapshot: RoadmapSnapshot) {
  const current = currentQuarter();
  const publishedQuarters = [current, shiftQuarter(current, 1), shiftQuarter(current, 2)];
  const initiatives = publishedQuarters.flatMap((quarter) => visibleInitiatives(snapshot.initiatives, quarter));
  const projects = visibleProjectsForBoard(snapshot.projects);

  return {
    syncedAt: snapshot.syncedAt,
    source: snapshot.source,
    initiatives: initiatives.map(({ id, name, summary, status, health, targetDate }) => ({ id, name, summary, status, health, targetDate })),
    projects: projects.map(({ id, name, summary, status, priority, health, targetDate, initiativeIds }) => ({ id, name, summary, status, priority: priority ?? null, health, targetDate, initiativeIds })),
  };
}
