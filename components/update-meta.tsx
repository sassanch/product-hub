import { HealthBadge, RelativeUpdate } from "@/components/status";
import type { Health } from "@/lib/types";

export function UpdateMeta({ health, author, updatedAt }: { health: Health; author?: string | null; updatedAt: string | null }) {
  return <div className="update-meta"><HealthBadge health={health}/>{author ? <span className="update-author">By {author}</span> : null}<time><RelativeUpdate value={updatedAt}/></time></div>;
}
