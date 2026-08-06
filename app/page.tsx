import { AppShell } from "@/components/app-shell";
import { RoadmapBoard } from "@/components/roadmap-board";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const snapshot = await getRoadmapSnapshot();
  return <AppShell active="roadmap" snapshot={snapshot}><RoadmapBoard snapshot={snapshot}/></AppShell>;
}
