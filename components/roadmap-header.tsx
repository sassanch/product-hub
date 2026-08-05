import type { RoadmapSnapshot } from "@/lib/types";

export function RoadmapHeader({snapshot}:{snapshot:RoadmapSnapshot}) {
  const synced=snapshot.syncedAt?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(snapshot.syncedAt)):"Awaiting first sync";
  return <div className="hero"><div><span className="eyebrow">Outcome-based roadmap</span><h1>What we’re trying to accomplish.</h1><p>Our quarterly goals, the projects moving them forward, and how those projects will reach the business.</p></div><div className="sync"><span className="sync-dot"/><span>Loaded from Linear {synced}</span>{snapshot.source==="preview"&&<span className="preview-pill">Preview data</span>}</div></div>;
}
