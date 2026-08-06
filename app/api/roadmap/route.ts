import { getRoadmapSnapshot } from "@/lib/google-sheets";
export async function GET(){return Response.json(await getRoadmapSnapshot(),{headers:{"Cache-Control":"public, no-store"}})}
