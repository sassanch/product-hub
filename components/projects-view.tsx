import { AppShell } from "@/components/app-shell";
import { ProjectCard } from "@/components/project-card";
import { sortProjectsByPriority, visibleProjectsForBoard } from "@/lib/roadmap";
import type { RoadmapSnapshot } from "@/lib/types";

const statusOrder = ["Planned", "Shaping", "Ready", "Building", "Build Complete", "Rollout", "Maintenance"];
const descriptions: Record<string, string> = { Planned: "Prioritized for development", Shaping: "Defining scope and approach", Ready: "Ready for engineering", Building: "Actively in development", "Build Complete": "Ready for rollout", Rollout: "Releasing to users", Maintenance: "Completed in the last six months" };

export function ProjectsView({ snapshot }: { snapshot: RoadmapSnapshot }) {
  const visible = visibleProjectsForBoard(snapshot.projects);
  return <AppShell active="projects" snapshot={snapshot}><div className="context-bar"><div><strong>PROD projects</strong><span>·</span><span>{visible.length} included</span></div><span className="scroll-note">Scroll horizontally to see all statuses</span></div><main className="projects-board">{statusOrder.map((status) => { const items = sortProjectsByPriority(visible.filter((project) => project.status === status)); return <section className="project-column" key={status}><header><div><strong>{status}</strong><span>{items.length}</span></div><p>{descriptions[status]}</p></header><div className="project-cards">{items.map((project) => { const goal = snapshot.initiatives.find((initiative) => project.initiativeIds.includes(initiative.id)); return <ProjectCard key={project.id} project={project} goalName={goal?.name}/>; })}</div></section>; })}</main></AppShell>;
}
