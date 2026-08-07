import { notFound } from "next/navigation";
import { DataOutage } from "@/components/data-outage";
import { ProjectDrawer } from "@/components/project-drawer";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export default async function InterceptedProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const snapshot = await getRoadmapSnapshot();
  if (!snapshot) return <DataOutage/>;
  const project = snapshot.projects.find((item) => item.id === id); if (!project) notFound();
  const goals = snapshot.initiatives.filter((goal) => project.initiativeIds.includes(goal.id));
  return <ProjectDrawer project={project} goals={goals}/>;
}
