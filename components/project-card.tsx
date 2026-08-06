import Link from "next/link";
import type { Project } from "@/lib/types";
import { HealthBadge } from "./status";

export function ProjectCard({project,goalName}:{project:Project;goalName?:string|null}) {
  return <Link href={`/projects/${project.id}`} className="kanban-card"><h3>{project.name}</h3>{project.summary&&<p>{project.summary}</p>}<div className="kanban-meta"><HealthBadge health={project.health}/>{project.targetDate&&<time>{project.targetDate.slice(0,7)}</time>}</div><span className="goal-link">{goalName||"Unlinked project"}</span></Link>;
}
