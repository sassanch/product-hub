import { notFound } from "next/navigation";
import { DataOutage } from "@/components/data-outage";
import { GoalDrawer } from "@/components/goal-drawer";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export default async function InterceptedGoalDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snapshot = await getRoadmapSnapshot();
  if (!snapshot) return <DataOutage/>;
  const goal = snapshot.initiatives.find((initiative) => initiative.id === id);
  if (!goal) notFound();
  const projects = snapshot.projects.filter((project) => project.initiativeIds.includes(goal.id));
  return <GoalDrawer goal={goal} projects={projects}/>;
}
