import Link from "next/link";
import { getGoalProjects } from "@/lib/roadmap";
import type { Initiative,Project } from "@/lib/types";
import { HealthBadge } from "./status";

export function GoalCard({goal,projects}:{goal:Initiative;projects:Project[]}) {
  const linked=getGoalProjects(goal,projects);
  return <Link href={`/goals/${goal.id}`} className="outcome-card"><div className="card-title"><h3>{goal.name}</h3><HealthBadge health={goal.health}/></div><p className={goal.latestUpdate?"":"empty-copy"}>{goal.latestUpdate||"No status update posted yet."}</p><footer><span>{goal.owner||"Owner not set"}</span><span>{linked.length} {linked.length===1?"project":"projects"}</span></footer></Link>;
}
