import Link from "next/link";
import { CalendarDays, ChevronRight, UserRound } from "lucide-react";
import { getGoalProjects } from "@/lib/roadmap";
import type { Initiative, Project } from "@/lib/types";
import { HealthBadge, RelativeUpdate } from "./status";

export function GoalCard({ goal, projects }: {goal:Initiative;projects:Project[]}) {
  const linked=getGoalProjects(goal,projects);
  return <article className="goal-card"><div className="card-top"><div><span className="eyebrow">Outcome</span><h3>{goal.name}</h3><p className={goal.summary?"summary":"summary empty-copy"}>{goal.summary||"Outcome summary not set"}</p></div><span className="status">{goal.status}</span></div><div className="meta"><span><UserRound size={14}/>{goal.owner||<em>Owner not set</em>}</span><span><CalendarDays size={14}/>{goal.targetDate||<em>Target date not set</em>}</span><HealthBadge health={goal.health}/></div><div className="update"><div className="update-label"><span>Latest update</span><span><RelativeUpdate value={goal.latestUpdateAt}/></span></div><p className={goal.latestUpdate?"":"empty-copy"}>{goal.latestUpdate||"No recent update from Linear"}</p></div><div className="linked"><div className="linked-label">Projects · {linked.length}</div>{linked.length?linked.slice(0,3).map((project)=><Link href={`/projects/${project.id}`} className="project-row" key={project.id}><span>{project.name}</span><small>{project.status} <ChevronRight className="arrow" size={14}/></small></Link>):<div className="project-row empty-copy">No linked projects</div>}</div></article>;
}
