import type { StatusUpdate } from "@/lib/types";
import { HealthBadge } from "./status";

export function StatusFeed({ updates }: { updates: StatusUpdate[] }) {
  if (!updates.length) return <div className="feed-empty">No status updates have been posted in Linear yet.</div>;
  return <div className="status-feed">{updates.map((update,index)=><article className="feed-item" key={update.id}><div className="feed-marker"><span/>{index<updates.length-1&&<i/>}</div><div className="feed-content"><div className="feed-meta"><time dateTime={update.createdAt}>{new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric"}).format(new Date(update.createdAt))}</time><HealthBadge health={update.health}/></div><p>{update.body}</p></div></article>)}</div>;
}
