import Link from "next/link";
import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StatusFeed } from "@/components/status-feed";
import { DateText,HealthBadge,RelativeUpdate } from "@/components/status";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export default async function ProjectDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const snapshot=await getRoadmapSnapshot();const p=snapshot.projects.find(item=>item.id===id);if(!p)notFound();const goals=snapshot.initiatives.filter(g=>p.initiativeIds.includes(g.id));
  return <AppShell active="projects" snapshot={snapshot}><div className="context-bar"><div><strong>All projects</strong><span>·</span><span>{snapshot.projects.length} projects</span></div></div><div className="detail-backdrop"><Link href="/projects" aria-label="Close project"/></div><aside className="detail-drawer"><header className="drawer-head"><div><span className="drawer-kicker">Project</span><h1>{p.name}</h1></div><Link href="/projects" aria-label="Close"><X size={19}/></Link></header><section className="drawer-facts"><div><span>Status</span><HealthBadge health={p.health}/></div><div><span>Assignee</span><strong>{p.lead||"Not set"}</strong></div><div><span>Timing</span><strong><DateText value={p.targetDate} empty="Target date not set"/></strong></div><div><span>Outcome</span><strong className="accent">{goals[0]?.name||"No linked outcome"}</strong></div></section><section className="drawer-section"><h2>Latest update</h2><div className="latest-update"><div><HealthBadge health={p.health}/><time><RelativeUpdate value={p.latestUpdateAt}/></time></div><p>{p.latestUpdate||"No recent update from Linear."}</p></div></section><section className="drawer-section"><h2>Status history</h2><StatusFeed updates={p.statusUpdates}/></section><section className="drawer-section"><h2>Rollout milestones</h2>{p.milestones.length?<div className="milestone-list">{p.milestones.map(m=><div key={m.id}><i/><p><strong>{m.name}</strong><span><DateText value={m.targetDate} empty="Date not set"/>{m.description?` · ${m.description}`:""}</span></p></div>)}</div>:<p className="drawer-empty">No milestones added in Linear.</p>}</section></aside></AppShell>;
}
