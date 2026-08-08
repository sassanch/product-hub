import Link from "next/link";
import type { Project } from "@/lib/types";
import { CompactDate, HealthBadge } from "./status";

export function ProjectCard({project}:{project:Project}) {
  return <Link href={`/projects/${project.id}`} className="kanban-card"><h3>{project.name}</h3>{project.summary&&<p>{project.summary}</p>}<div className="kanban-meta"><HealthBadge health={project.health}/>{project.targetDate&&<time dateTime={project.targetDate}><CompactDate value={project.targetDate}/></time>}</div></Link>;
}
