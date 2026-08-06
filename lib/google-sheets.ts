import { createSign } from "node:crypto";
import { cache } from "react";
import { demoSnapshot } from "@/lib/demo-data";
import { sanitizePlainText } from "@/lib/roadmap";
import type { Health, Initiative, Project, StatusUpdate } from "@/lib/types";

const tokenEndpoint = "https://oauth2.googleapis.com/token";
const sheetsEndpoint = "https://sheets.googleapis.com/v4/spreadsheets";
const scope = "https://www.googleapis.com/auth/spreadsheets.readonly";

type ValueRange = { values?: string[][] };
type BatchGetResponse = { valueRanges?: ValueRange[]; error?: { message?: string } };

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) throw new Error("Google Sheets credentials are not configured");

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(JSON.stringify({ iss: email, scope, aud: tokenEndpoint, iat: now, exp: now + 3600 }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${base64url(signer.sign(privateKey))}`;
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    cache: "no-store",
  });
  const result = await response.json() as { access_token?: string; error_description?: string };
  if (!response.ok || !result.access_token) throw new Error(result.error_description || `Google authentication failed (${response.status})`);
  return result.access_token;
}

async function readRanges(spreadsheetId: string, ranges: string[], accessToken: string) {
  const params = new URLSearchParams({ majorDimension: "ROWS", valueRenderOption: "FORMATTED_VALUE" });
  ranges.forEach((range) => params.append("ranges", range));
  const response = await fetch(`${sheetsEndpoint}/${encodeURIComponent(spreadsheetId)}/values:batchGet?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const result = await response.json() as BatchGetResponse;
  if (!response.ok || !result.valueRanges) throw new Error(result.error?.message || `Google Sheets read failed (${response.status})`);
  return result.valueRanges;
}

function cell(range: ValueRange, row: number, column = 0) {
  return range.values?.[row]?.[column]?.trim() ?? "";
}

export function sheetDate(value: string, exclusiveEnd = false): string | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(value);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[3]), Number(match[1]) - 1, Number(match[2])));
  if (exclusiveEnd) date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function sheetDateTime(value: string): string | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(value);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[3]), Number(match[1]) - 1, Number(match[2]), Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0))).toISOString();
}

export function sheetHealth(value: string): Health {
  const normalized = value.toLowerCase();
  if (normalized.includes("off track")) return "offTrack";
  if (normalized.includes("at risk")) return "atRisk";
  if (normalized.includes("on track")) return "onTrack";
  return null;
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function latestUpdate(id: string, body: string, createdAt: string, health: Health): StatusUpdate[] {
  const clean = sanitizePlainText(body);
  const date = sheetDateTime(createdAt);
  return clean && date ? [{ id: `${id}-latest`, body: clean, createdAt: date, health }] : [];
}

export function sheetMilestones(projectId: string, value: string) {
  return value.split(/,(?=[^,]+\[[^\]]+\])/).map((entry, index) => {
    const match = /^(.+?)\[[^\]]+\](?:\(Target Date:\s*(\d{4}-\d{2}-\d{2})\))?$/.exec(entry.trim());
    if (!match) return null;
    return { id: `${projectId}-milestone-${index}`, name: match[1].trim(), description: null, targetDate: match[2] ?? null };
  }).filter((milestone): milestone is NonNullable<typeof milestone> => Boolean(milestone));
}

function mapInitiatives(ranges: ValueRange[]): Initiative[] {
  const [identity, description, status, ownership, dates, teamsAndUpdates] = ranges;
  const rows = Math.max(...ranges.map((range) => range.values?.length ?? 0));
  const initiatives: Initiative[] = [];
  for (let row = 0; row < rows; row += 1) {
    const id = cell(identity, row, 0);
    const name = cell(identity, row, 2);
    if (!id || !name) continue;
    const health = sheetHealth(cell(teamsAndUpdates, row, 1));
    const updates = latestUpdate(id, cell(teamsAndUpdates, row, 2), cell(teamsAndUpdates, row, 3), health);
    initiatives.push({
      id,
      name,
      summary: sanitizePlainText(cell(description, row), 255),
      status: cell(status, row),
      health,
      owner: cell(ownership, row) || null,
      targetDate: sheetDate(cell(dates, row, 1), true) ?? sheetDate(cell(dates, row, 0)),
      latestUpdate: updates[0]?.body ?? null,
      latestUpdateAt: updates[0]?.createdAt ?? null,
      statusUpdates: updates,
    });
  }
  return initiatives;
}

function statusType(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) return "canceled";
  if (normalized.includes("maintenance") || normalized.includes("complete")) return "completed";
  if (normalized.includes("build") || normalized.includes("progress") || normalized.includes("rollout")) return "started";
  return "planned";
}

function mapProjects(ranges: ValueRange[]): Project[] {
  const [identity, summary, status, milestones, lead, dates, portfolio, initiativeIds] = ranges;
  const rows = Math.max(...ranges.map((range) => range.values?.length ?? 0));
  const projects: Project[] = [];
  for (let row = 0; row < rows; row += 1) {
    const id = cell(identity, row, 0);
    const name = cell(identity, row, 1);
    if (!id || !name) continue;
    const health = sheetHealth(cell(portfolio, row, 2));
    const updates = latestUpdate(id, cell(portfolio, row, 3), cell(portfolio, row, 4), health);
    projects.push({
      id,
      name,
      summary: sanitizePlainText(cell(summary, row), 255),
      status: cell(status, row),
      statusType: statusType(cell(status, row)),
      health,
      lead: cell(lead, row) || null,
      startDate: sheetDate(cell(dates, row, 0)),
      targetDate: sheetDate(cell(dates, row, 3), true) ?? sheetDate(cell(dates, row, 2)),
      initiativeIds: splitList(cell(initiativeIds, row)),
      teamNames: splitList(cell(portfolio, row, 0)),
      milestones: sheetMilestones(id, cell(milestones, row)),
      latestUpdate: updates[0]?.body ?? null,
      latestUpdateAt: updates[0]?.createdAt ?? null,
      statusUpdates: updates,
    });
  }
  return projects;
}

async function fetchSheetsSnapshot() {
  const projectsId = process.env.GOOGLE_PROJECTS_SHEET_ID;
  const initiativesId = process.env.GOOGLE_INITIATIVES_SHEET_ID;
  if (!projectsId || !initiativesId || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) return demoSnapshot;

  try {
    const accessToken = await getAccessToken();
    const [initiativeRanges, projectRanges] = await Promise.all([
      readRanges(initiativesId, ["Initiatives!A2:C1000", "Initiatives!E2:E1000", "Initiatives!G2:G1000", "Initiatives!I2:I1000", "Initiatives!J2:K1000", "Initiatives!Q2:T1000"], accessToken),
      readRanges(projectsId, ["Projects!A2:B1000", "Projects!D2:D1000", "Projects!F2:F1000", "Projects!H2:H1000", "Projects!J2:J1000", "Projects!L2:O1000", "Projects!V2:Z1000", "Projects!AF2:AF1000"], accessToken),
    ]);
    return { initiatives: mapInitiatives(initiativeRanges).filter((initiative) => initiative.owner === "Stefano Sanchez"), projects: mapProjects(projectRanges), syncedAt: new Date().toISOString(), source: "sheets" as const };
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Unable to load Google Sheets roadmap", error: error instanceof Error ? error.message : String(error) }));
    return demoSnapshot;
  }
}

export const getRoadmapSnapshot = cache(fetchSheetsSnapshot);
