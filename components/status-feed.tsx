import type { StatusUpdate } from "@/lib/types";
import { HealthBadge } from "./status";

export function StatusFeed({updates}:{updates:StatusUpdate[]}) {
  if(!updates.length)return <p className="drawer-empty">No status updates have been posted in Linear yet.</p>;
  return <div className="status-feed">{updates.map((update,index)=><article className="feed-item" key={update.id}><div className="feed-rail"><i/>{index<updates.length-1&&<span/>}</div><div><header><HealthBadge health={update.health}/><time>{new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(update.createdAt))}</time></header><p>{update.body}</p></div></article>)}</div>;
}
