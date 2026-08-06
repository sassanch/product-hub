import { AppShell } from "@/components/app-shell";
import { ProjectCard } from "@/components/project-card";
import { getRoadmapSnapshot } from "@/lib/linear";
import { groupForStatus } from "@/lib/roadmap";

export const dynamic="force-dynamic";

const stages=[
  {name:"Planned",description:"Committed, not yet started"},
  {name:"Shaping",description:"Defining scope and approach"},
  {name:"Building",description:"Actively in development"},
  {name:"Rollout",description:"Shipping to users"},
  {name:"Maintenance",description:"Live and being maintained"},
  {name:"Canceled",description:"No longer active"},
];
function stageFor(type:string,status:string){const value=`${type} ${status}`.toLowerCase();if(value.includes("cancel"))return "Canceled";if(value.includes("complete")||value.includes("maintenance")||value.includes("shipped"))return "Maintenance";if(value.includes("rollout")||value.includes("launch"))return "Rollout";if(groupForStatus(type,status)==="Building")return "Building";if(value.includes("planned")||value.includes("backlog"))return "Planned";return "Shaping";}

export default async function ProjectsPage(){
  const snapshot=await getRoadmapSnapshot();
  const visible=snapshot.projects.filter(p=>p.teamNames.includes("Product")||p.initiativeIds.length>0);
  const active=visible.filter(p=>stageFor(p.statusType,p.status)!=="Canceled").length;
  return <AppShell active="projects" snapshot={snapshot}><div className="context-bar"><div><strong>All projects</strong><span>·</span><span>{active} active</span><span>·</span><span>{visible.length-active} canceled</span></div><span className="scroll-note">Scroll horizontally to see all columns</span></div><main className="projects-board">{stages.map(stage=>{const items=visible.filter(p=>stageFor(p.statusType,p.status)===stage.name);return <section className="project-column" key={stage.name}><header><div><strong>{stage.name}</strong><span>{items.length}</span></div><p>{stage.description}</p></header><div className="project-cards">{items.map(p=>{const goal=snapshot.initiatives.find(g=>p.initiativeIds.includes(g.id));return <ProjectCard key={p.id} project={p} goalName={goal?.name}/>})}</div></section>})}</main></AppShell>;
}
