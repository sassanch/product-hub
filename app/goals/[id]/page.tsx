import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { GoalDrawer } from "@/components/goal-drawer";
import { RoadmapBoard } from "@/components/roadmap-board";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export default async function GoalDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const snapshot=await getRoadmapSnapshot();const goal=snapshot.initiatives.find(i=>i.id===id);if(!goal)notFound();const projects=snapshot.projects.filter(p=>p.initiativeIds.includes(goal.id));
  return <AppShell active="roadmap" snapshot={snapshot}><RoadmapBoard snapshot={snapshot}/><GoalDrawer goal={goal} projects={projects}/></AppShell>;
}
