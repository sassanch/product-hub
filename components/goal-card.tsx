import Link from "next/link";
import { getGoalProjects } from "@/lib/roadmap";
import type { Initiative,Project } from "@/lib/types";
import { HealthBadge } from "./status";

export function GoalCard({goal,projects}:{goal:Initiative;projects:Project[]}) {
  const linked=getGoalProjects(goal,projects);
  return <Link href={`/goals/${goal.id}`} prefetch={true} className="outcome-card"><div className="card-title"><div className="card-copy"><h3>{goal.name}</h3><p className={goal.summary?"":"empty-copy"}>{goal.summary||"Description not provided."}</p></div><HealthBadge health={goal.health}/></div><footer><span>{goal.status||"Status not set"}</span><span>{linked.length} {linked.length===1?"project":"projects"}</span></footer></Link>;
}
