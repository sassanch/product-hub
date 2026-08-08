import { DataOutage } from "@/components/data-outage";
import { ProjectsView } from "@/components/projects-view";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const snapshot = await getRoadmapSnapshot();
  if (!snapshot) return <DataOutage/>;
  return <ProjectsView snapshot={snapshot}/>;
}
