import { AppShell } from "@/components/app-shell";
import { GoalCard } from "@/components/goal-card";
import { Navigation } from "@/components/navigation";
import { RoadmapHeader } from "@/components/roadmap-header";
import { getRoadmapSnapshot } from "@/lib/linear";
import { currentQuarter, snapshotQuarter } from "@/lib/roadmap";

export default async function GoalsPage({searchParams}:{searchParams:Promise<{quarter?:string}>}) {
  const [{quarter},snapshot]=await Promise.all([searchParams,getRoadmapSnapshot()]);
  const selected=/^Q[1-4] \d{4}$/.test(quarter||"")?quarter!:currentQuarter();
  const {goals,projects}=snapshotQuarter(snapshot,selected);
  return <AppShell><RoadmapHeader snapshot={snapshot}/><Navigation active="goals" quarter={selected}/><section><div className="section-head"><div><h2>{selected} goals</h2><p>The measurable outcomes guiding product work this quarter.</p></div><span className="count">{goals.length} {goals.length===1?"goal":"goals"}</span></div>{goals.length?<div className="goal-grid">{goals.map((goal)=><GoalCard key={goal.id} goal={goal} projects={projects}/>)}</div>:<div className="empty-state"><h3>No goals in {selected}</h3><p>Initiatives appear here when their Linear target date falls in this quarter.</p></div>}</section></AppShell>;
}
