import { ProjectsView } from "@/components/projects-view";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export const dynamic="force-dynamic";

export default async function ProjectsPage(){
  const snapshot=await getRoadmapSnapshot();
  return <ProjectsView snapshot={snapshot}/>;
}
