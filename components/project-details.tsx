import { MarkdownContent } from "@/components/markdown-content";
import { DateText } from "@/components/status";
import { UpdateMeta } from "@/components/update-meta";
import { visibleProjectMilestones } from "@/lib/roadmap";
import type { Project } from "@/lib/types";

export function ProjectDetails({ project }: { project: Project }) {
  const milestones = visibleProjectMilestones(project.milestones);

  return <>
    <section className="drawer-facts">
      <div><span>Phase</span><strong>{project.status || "Not set"}</strong></div>
      <div><span>Lead</span><strong>{project.lead || "Not set"}</strong></div>
      <div><span>Build start</span><strong><DateText value={project.startDate} empty="Start date not set"/></strong></div>
      <div><span>Target completion</span><strong><DateText value={project.targetDate} empty="Target date not set"/></strong></div>
    </section>
    <section className="drawer-section">
      <h2>Latest update</h2>
      <div className="latest-update">
        <UpdateMeta health={project.health} author={project.statusUpdates[0]?.author} updatedAt={project.latestUpdateAt} showHealth={false}/>
        <MarkdownContent>{project.latestUpdate || "No recent update from Linear."}</MarkdownContent>
      </div>
    </section>
    <section className="drawer-section">
      <h2>Rollout milestones</h2>
      {milestones.length ? <div className="milestone-list">{milestones.map((milestone) => <div key={milestone.id}><i/><p><strong>{milestone.name}</strong><span><DateText value={milestone.targetDate} empty="Date not set"/>{milestone.description ? ` · ${milestone.description}` : ""}</span></p></div>)}</div> : <p className="drawer-empty">No milestones added in Linear.</p>}
    </section>
  </>;
}
