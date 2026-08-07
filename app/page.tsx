import { AppShell } from "@/components/app-shell";
import { DataOutage } from "@/components/data-outage";
import { RoadmapBoard } from "@/components/roadmap-board";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const snapshot = await getRoadmapSnapshot();
  if (!snapshot) return <DataOutage/>;
  return <AppShell active="roadmap" snapshot={snapshot}><RoadmapBoard snapshot={snapshot}/></AppShell>;
}
