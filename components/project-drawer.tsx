import { DrawerFrame } from "@/components/drawer-frame";
import { MarkdownContent } from "@/components/markdown-content";
import { DateText, HealthBadge, RelativeUpdate } from "@/components/status";
import { visibleProjectMilestones } from "@/lib/roadmap";
import type { Initiative, Project } from "@/lib/types";

export function ProjectDrawer({ project, goals, closeHref }: { project: Project; goals: Initiative[]; closeHref?: string }) {
  const milestones = visibleProjectMilestones(project.milestones);
  return <DrawerFrame kicker="Project" title={project.name} closeHref={closeHref}><section className="drawer-facts"><div><span>Status</span><HealthBadge health={project.health}/></div><div><span>Lead</span><strong>{project.lead || "Not set"}</strong></div><div><span>Timing</span><strong><DateText value={project.targetDate} empty="Target date not set"/></strong></div><div><span>Outcome</span><strong className="accent">{goals[0]?.name || "No linked outcome"}</strong></div></section><section className="drawer-section"><h2>Latest update</h2><div className="latest-update"><div className="update-meta"><HealthBadge health={project.health}/><time><RelativeUpdate value={project.latestUpdateAt}/></time></div><MarkdownContent>{project.latestUpdate || "No recent update from Linear."}</MarkdownContent></div></section><section className="drawer-section"><h2>Rollout milestones</h2>{milestones.length ? <div className="milestone-list">{milestones.map((milestone) => <div key={milestone.id}><i/><p><strong>{milestone.name}</strong><span><DateText value={milestone.targetDate} empty="Date not set"/>{milestone.description ? ` · ${milestone.description}` : ""}</span></p></div>)}</div> : <p className="drawer-empty">No milestones added in Linear.</p>}</section></DrawerFrame>;
}
