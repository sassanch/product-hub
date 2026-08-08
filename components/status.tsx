import type { Health } from "@/lib/types";

export function HealthBadge({health}:{health:Health}) {
  const labels={onTrack:"On track",atRisk:"At risk",offTrack:"Off track"};
  if(!health)return <span className="health-badge no-update"><i/>No update</span>;
  return <span className={`health-badge ${health}`}><i/>{labels[health]}</span>;
}
export function DateText({value,empty="Date not set"}:{value:string|null;empty?:string}) {
  return value?<>{new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date(`${value}T12:00:00Z`))}</>:<span className="empty-copy">{empty}</span>;
}
export function CompactDate({value}:{value:string}) {
  return <>{new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"UTC"}).format(new Date(`${value}T12:00:00Z`))}</>;
}
export function RelativeUpdate({value}:{value:string|null}) {
  return value?<>{new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date(value))}</>:<>No recent update</>;
}
