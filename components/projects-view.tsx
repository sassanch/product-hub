import { AppShell } from "@/components/app-shell";
import { ProjectCard } from "@/components/project-card";
import { visibleProjectsForBoard } from "@/lib/roadmap";
import type { RoadmapSnapshot } from "@/lib/types";

const statusOrder = ["Ready", "Shaping", "Building", "Build Complete", "Rollout", "Maintenance"];
const descriptions: Record<string, string> = { Ready: "Ready to begin", Shaping: "Defining scope and approach", Building: "Actively in development", "Build Complete": "Build work finished", Rollout: "Releasing to users", Maintenance: "Completed in the last six months" };

export function ProjectsView({ snapshot }: { snapshot: RoadmapSnapshot }) {
  const visible = visibleProjectsForBoard(snapshot.projects);
  const statuses = Array.from(new Set(visible.map((project) => project.status))).sort((a, b) => {
    const aIndex = statusOrder.indexOf(a); const bIndex = statusOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1; if (bIndex === -1) return -1; return aIndex - bIndex;
  });
  return <AppShell active="projects" snapshot={snapshot}><div className="context-bar"><div><strong>PROD projects</strong><span>·</span><span>{visible.length} included</span></div><span className="scroll-note">Scroll horizontally to see all statuses</span></div><main className="projects-board">{statuses.map((status) => { const items = visible.filter((project) => project.status === status); return <section className="project-column" key={status}><header><div><strong>{status}</strong><span>{items.length}</span></div><p>{descriptions[status] || "Linear status"}</p></header><div className="project-cards">{items.map((project) => { const goal = snapshot.initiatives.find((initiative) => project.initiativeIds.includes(initiative.id)); return <ProjectCard key={project.id} project={project} goalName={goal?.name}/>; })}</div></section>; })}</main></AppShell>;
}
