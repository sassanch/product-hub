import { AppShell } from "@/components/app-shell";
import { DragScrollBoard } from "@/components/drag-scroll-board";
import { ProjectCard } from "@/components/project-card";
import { sortProjectsByPriority, visibleProjectsForBoard } from "@/lib/roadmap";
import type { RoadmapSnapshot } from "@/lib/types";

const statusOrder = ["Maintenance", "Rollout", "Build Complete", "Building", "Ready", "Shaping", "Planned"];
const descriptions: Record<string, string> = { Planned: "Prioritized for development", Shaping: "Defining scope and approach", Ready: "Ready for engineering", Building: "Actively in development", "Build Complete": "Ready for rollout", Rollout: "Releasing to users", Maintenance: "Completed in the last six months" };

export function ProjectsView({ snapshot }: { snapshot: RoadmapSnapshot }) {
  const visible = visibleProjectsForBoard(snapshot.projects);
  const columns = statusOrder.map((status) => ({ status, items: sortProjectsByPriority(visible.filter((project) => project.status === status)) })).filter(({ items }) => items.length > 0);
  return <AppShell snapshot={snapshot}><DragScrollBoard>{columns.length ? columns.map(({ status, items }) => <section className="project-column" key={status}><header><div><strong>{status}</strong></div><p>{descriptions[status]}</p></header><div className="project-cards">{items.map((project) => <ProjectCard key={project.id} project={project}/>)}</div></section>) : <div className="board-empty"><strong>No published projects</strong><span>Projects will appear here when they enter an included status.</span></div>}</DragScrollBoard></AppShell>;
}
