import { auth } from "@/auth";
import { getRoadmapSnapshot } from "@/lib/google-sheets";
import { publicRoadmapSnapshot } from "@/lib/public-roadmap";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });

  try {
    const snapshot = await getRoadmapSnapshot();
    if (!snapshot) return Response.json({ error: "Roadmap data is temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
    return Response.json(publicRoadmapSnapshot(snapshot), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Roadmap data is temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
