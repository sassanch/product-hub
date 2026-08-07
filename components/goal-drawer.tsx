import { DrawerFrame } from "@/components/drawer-frame";
import { MarkdownContent } from "@/components/markdown-content";
import { ProjectCard } from "@/components/project-card";
import { DateText, HealthBadge } from "@/components/status";
import { UpdateMeta } from "@/components/update-meta";
import type { Initiative, Project } from "@/lib/types";

export function GoalDrawer({ goal, projects, closeHref }: { goal: Initiative; projects: Project[]; closeHref?: string }) {
  return <DrawerFrame kicker="Outcome" title={goal.name} tagline={goal.summary} closeHref={closeHref}><section className="drawer-facts"><div><span>Status</span><strong>{goal.status}</strong></div><div><span>Owner</span><strong>{goal.owner||"Not set"}</strong></div><div><span>Target</span><strong><DateText value={goal.targetDate} empty="Target date not set"/></strong></div><div><span>Health</span><HealthBadge health={goal.health}/></div></section><section className="drawer-section"><h2>Latest update</h2><div className="latest-update"><UpdateMeta health={goal.health} author={goal.statusUpdates[0]?.author} updatedAt={goal.latestUpdateAt}/><MarkdownContent>{goal.latestUpdate||"No recent update from Linear."}</MarkdownContent></div></section><section className="drawer-section"><h2>Supporting projects</h2>{projects.length?<div className="drawer-projects">{projects.map((project)=><ProjectCard key={project.id} project={project} goalName={goal.name}/>)}</div>:<p className="drawer-empty">No projects linked in Linear.</p>}</section></DrawerFrame>;
}
