import { getRoadmapSnapshot } from "@/lib/google-sheets";
import { publicRoadmapSnapshot } from "@/lib/public-roadmap";

export async function GET() {
  try {
    const snapshot = await getRoadmapSnapshot();
    if (!snapshot) return Response.json({ error: "Roadmap data is temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
    return Response.json(publicRoadmapSnapshot(snapshot), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Roadmap data is temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
