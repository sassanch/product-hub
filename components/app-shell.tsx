import Link from "next/link";
import { CircleCheck } from "lucide-react";
import type { RoadmapSnapshot } from "@/lib/types";

export function AppShell({children,snapshot}:{children:React.ReactNode;snapshot?:RoadmapSnapshot}) {
  const updated=snapshot?.syncedAt?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(snapshot.syncedAt)):"Waiting for Linear";
  return <div className="app-shell"><header className="app-header"><Link className="app-brand" href="/"><CircleCheck size={19}/><strong>Plei</strong><span>/</span><span>Product Roadmap</span></Link><div className="last-sync">Updated {updated}{snapshot?.source==="preview"&&<b>Preview</b>}</div></header>{children}</div>;
}
