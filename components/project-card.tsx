import Link from "next/link";
import { ArrowUpRight, CalendarDays, Flag, UserRound } from "lucide-react";
import { groupForStatus } from "@/lib/roadmap";
import type { Project } from "@/lib/types";
import { HealthBadge } from "./status";

export function ProjectCard({ project }: {project:Project}) {
  return <Link href={`/projects/${project.id}`} className="project-card"><div className="card-top"><span className="stage">{groupForStatus(project.statusType,project.status)}</span><ArrowUpRight size={17}/></div><h3>{project.name}</h3><p className={project.summary?"summary":"summary empty-copy"}>{project.summary||"Executive summary not set"}</p><div className="meta"><span><Flag size={14}/>{project.status}</span><span><UserRound size={14}/>{project.lead||<em>Lead not set</em>}</span><span><CalendarDays size={14}/>{project.targetDate||<em>Target date not set</em>}</span><HealthBadge health={project.health}/></div></Link>;
}
