import { cache } from "react";
import { demoSnapshot } from "@/lib/demo-data";
import { sanitizePlainText } from "@/lib/roadmap";
import type { Health, Initiative, Project } from "@/lib/types";

const endpoint = "https://api.linear.app/graphql";
async function graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const key = process.env.LINEAR_API_KEY;
  if (!key) throw new Error("LINEAR_API_KEY is not configured");
  const response = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json", Authorization:key}, body:JSON.stringify({query, variables}), cache:"no-store" });
  const result = await response.json() as { data?: T; errors?: { message: string }[] };
  if (!response.ok || result.errors?.length || !result.data) throw new Error(result.errors?.map((e) => e.message).join(", ") || `Linear request failed (${response.status})`);
  return result.data;
}

const INITIATIVES = `query RoadmapInitiatives { initiatives(first: 50, orderBy: updatedAt) { nodes { id name summary status health targetDate owner { name } initiativeUpdates(first: 10, orderBy: createdAt) { nodes { id body createdAt health } } } } }`;
const PROJECTS = `query RoadmapProjects { projects(first: 100, orderBy: updatedAt, includeArchived: false) { nodes { id name summary health startDate targetDate status { name type } lead { name } teams(first: 20) { nodes { name } } initiatives(first: 10) { nodes { id } } projectMilestones(first: 20) { nodes { id name description targetDate } } projectUpdates(first: 10, orderBy: createdAt) { nodes { id body createdAt health } } } } }`;

type UpdateNode = { id:string; body:string; createdAt:string; health?:Health };
type InitiativeNode = { id:string; name:string; summary?:string; status:string; health?:Health; targetDate?:string; owner?:{name:string}; initiativeUpdates:{nodes:UpdateNode[]} };
type ProjectNode = { id:string; name:string; summary?:string; health?:Health; startDate?:string; targetDate?:string; status:{name:string;type:string}; lead?:{name:string}; teams:{nodes:{name:string}[]}; initiatives:{nodes:{id:string}[]}; projectMilestones:{nodes:{id:string;name:string;description?:string;targetDate?:string}[]}; projectUpdates:{nodes:UpdateNode[]} };

function mapUpdates(nodes: UpdateNode[]) {
  return nodes.map((update) => ({ id:update.id, body:sanitizePlainText(update.body) ?? "Update details not provided", createdAt:update.createdAt, health:update.health ?? null }));
}

async function fetchLinearSnapshot() {
  if (!process.env.LINEAR_API_KEY) {
    return demoSnapshot;
  }
  try {
    const [initiativeData, projectData] = await Promise.all([
      graphql<{initiatives:{nodes:InitiativeNode[]}}>(INITIATIVES), graphql<{projects:{nodes:ProjectNode[]}}>(PROJECTS),
    ]);
    const initiatives: Initiative[] = initiativeData.initiatives.nodes.map((item) => { const updates=mapUpdates(item.initiativeUpdates.nodes);const update=updates[0];return { id:item.id, name:item.name, summary:sanitizePlainText(item.summary,255), status:item.status, health:item.health ?? null, owner:item.owner?.name ?? null, targetDate:item.targetDate ?? null, latestUpdate:update?.body ?? null, latestUpdateAt:update?.createdAt ?? null, statusUpdates:updates }; });
    const projects: Project[] = projectData.projects.nodes.map((item) => { const updates=mapUpdates(item.projectUpdates.nodes);const update=updates[0];return { id:item.id, name:item.name, summary:sanitizePlainText(item.summary,255), status:item.status.name, statusType:item.status.type, health:item.health ?? null, lead:item.lead?.name ?? null, startDate:item.startDate ?? null, targetDate:item.targetDate ?? null, initiativeIds:item.initiatives.nodes.map((i) => i.id), teamNames:item.teams.nodes.map((t) => t.name), milestones:item.projectMilestones.nodes.map((m) => ({id:m.id,name:m.name,description:sanitizePlainText(m.description,500),targetDate:m.targetDate ?? null})).sort((a,b) => (a.targetDate ?? "9999").localeCompare(b.targetDate ?? "9999")), latestUpdate:update?.body ?? null, latestUpdateAt:update?.createdAt ?? null, statusUpdates:updates }; });
    return { initiatives, projects, syncedAt: new Date().toISOString(), source: "linear" as const };
  } catch (error) {
    console.error("Unable to load Linear roadmap; serving preview data.", error);
    return demoSnapshot;
  }
}

// Deduplicates Linear reads when multiple server components render in one request.
// Every new page request receives fresh data directly from Linear.
export const getRoadmapSnapshot = cache(fetchLinearSnapshot);
