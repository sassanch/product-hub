import type { Health } from "@/lib/types";

export function HealthBadge({ health }: { health:Health }) {
  if (!health) return <span className="health empty-copy">Health not set</span>;
  const labels={onTrack:"On track",atRisk:"At risk",offTrack:"Off track"};
  return <span className={`health ${health}`}><i/>{labels[health]}</span>;
}

export function DateText({ value, empty="Date not set" }: {value:string|null;empty?:string}) {
  if (!value) return <span className="empty-copy">{empty}</span>;
  return <>{new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date(`${value}T12:00:00Z`))}</>;
}

export function RelativeUpdate({ value }: {value:string|null}) {
  if (!value) return <>No recent update</>;
  return <>{new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(value))}</>;
}
