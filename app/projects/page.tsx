import { AppShell } from "@/components/app-shell";
import { Navigation } from "@/components/navigation";
import { ProjectCard } from "@/components/project-card";
import { RoadmapHeader } from "@/components/roadmap-header";
import { getRoadmapSnapshot } from "@/lib/linear";
import { currentQuarter, groupForStatus, snapshotQuarter } from "@/lib/roadmap";

export const metadata={title:"Projects"};
export default async function ProjectsPage({searchParams}:{searchParams:Promise<{quarter?:string}>}) {
  const [{quarter},snapshot]=await Promise.all([searchParams,getRoadmapSnapshot()]);
  const selected=/^Q[1-4] \d{4}$/.test(quarter||"")?quarter!:currentQuarter();
  const {projects,unlinked}=snapshotQuarter(snapshot,selected);
  const linked=projects.filter((p)=>!unlinked.some((u)=>u.id===p.id));
  const groups=["Building","Rolling out","Shaping"].map((stage)=>({stage,items:linked.filter((p)=>groupForStatus(p.statusType,p.status)===stage)})).filter((g)=>g.items.length);
  return <AppShell><RoadmapHeader snapshot={snapshot}/><Navigation active="projects" quarter={selected}/>{groups.map(({stage,items})=><section key={stage}><div className="section-head"><div><h2>{stage}</h2><p>{stage==="Building"?"Projects actively moving through delivery.":stage==="Rolling out"?"Work reaching teammates or customers.":"Work being understood, scoped, and prepared."}</p></div><span className="count">{items.length}</span></div><div className="portfolio">{items.map((p)=><ProjectCard key={p.id} project={p}/>)}</div></section>)}<section><div className="section-head"><div><h2>Unlinked projects</h2><p>Product work that is not yet connected to a {selected} goal.</p></div><span className="count">{unlinked.length}</span></div>{unlinked.length?<div className="portfolio">{unlinked.map((p)=><ProjectCard key={p.id} project={p}/>)}</div>:<div className="empty-state"><h3>Everything is connected</h3><p>All visible product projects support a quarterly goal.</p></div>}</section></AppShell>;
}
