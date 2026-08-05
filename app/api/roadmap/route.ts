import { getRoadmapSnapshot } from "@/lib/linear";
export async function GET(){return Response.json(await getRoadmapSnapshot(),{headers:{"Cache-Control":"public, no-store"}})}
