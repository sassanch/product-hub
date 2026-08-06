import Link from "next/link";
import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ProjectCard } from "@/components/project-card";
import { StatusFeed } from "@/components/status-feed";
import { DateText,HealthBadge,RelativeUpdate } from "@/components/status";
import { getRoadmapSnapshot } from "@/lib/linear";
import { quarterFromDate } from "@/lib/roadmap";

export default async function GoalDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const snapshot=await getRoadmapSnapshot();const goal=snapshot.initiatives.find(i=>i.id===id);if(!goal)notFound();const projects=snapshot.projects.filter(p=>p.initiativeIds.includes(goal.id));const quarter=quarterFromDate(goal.targetDate);
  return <AppShell active="roadmap" snapshot={snapshot}><div className="context-bar"><div><strong>{quarter||"Roadmap"} outcome</strong><span>·</span><span>{projects.length} linked projects</span></div></div><div className="detail-backdrop"><Link href={`/?quarter=${encodeURIComponent(quarter||"")}`} aria-label="Close outcome"/></div><aside className="detail-drawer"><header className="drawer-head"><div><span className="drawer-kicker">Outcome</span><h1>{goal.name}</h1></div><Link href={`/?quarter=${encodeURIComponent(quarter||"")}`} aria-label="Close"><X size={19}/></Link></header><section className="drawer-facts"><div><span>Status</span><strong>{goal.status}</strong></div><div><span>Owner</span><strong>{goal.owner||"Not set"}</strong></div><div><span>Target</span><strong><DateText value={goal.targetDate} empty="Target date not set"/></strong></div><div><span>Health</span><HealthBadge health={goal.health}/></div></section><section className="drawer-section"><h2>Latest update</h2><div className="latest-update"><div><HealthBadge health={goal.health}/><time><RelativeUpdate value={goal.latestUpdateAt}/></time></div><p>{goal.latestUpdate||"No recent update from Linear."}</p></div></section><section className="drawer-section"><h2>Status history</h2><StatusFeed updates={goal.statusUpdates}/></section><section className="drawer-section"><h2>Supporting projects</h2>{projects.length?<div className="drawer-projects">{projects.map(p=><ProjectCard key={p.id} project={p} goalName={goal.name}/>)}</div>:<p className="drawer-empty">No projects linked in Linear.</p>}</section></aside></AppShell>;
}
