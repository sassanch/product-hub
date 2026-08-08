import { HealthBadge, RelativeUpdate } from "@/components/status";
import type { Health } from "@/lib/types";

export function UpdateMeta({ health, author, updatedAt, showHealth = true }: { health: Health; author?: string | null; updatedAt: string | null; showHealth?: boolean }) {
  return <div className="update-meta">{showHealth ? <HealthBadge health={health}/> : null}{author ? <span className="update-author">By {author}</span> : null}<time><RelativeUpdate value={updatedAt}/></time></div>;
}
