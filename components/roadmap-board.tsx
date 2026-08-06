import { GoalCard } from "@/components/goal-card";
import { currentQuarter, shiftQuarter, visibleInitiatives } from "@/lib/roadmap";
import type { RoadmapSnapshot } from "@/lib/types";

const months = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

export function RoadmapBoard({ snapshot }: { snapshot: RoadmapSnapshot }) {
  const selected = currentQuarter();
  const quarters = [selected, shiftQuarter(selected, 1), shiftQuarter(selected, 2)];
  const counts = quarters.map((quarter) => visibleInitiatives(snapshot.initiatives, quarter).length);

  return <><div className="context-bar"><div><strong>{quarters[0].replace(" ", "–")} outcomes</strong><span>·</span><span>{counts[0]} this quarter</span><span>·</span><span>{counts[1]} next quarter</span></div><div className="health-key"><span><i className="green"/>On track</span><span><i className="amber"/>At risk</span><span><i className="red"/>Off track</span></div></div><main className="roadmap-board">{quarters.map((quarter) => { const goals = visibleInitiatives(snapshot.initiatives, quarter); return <section className="quarter-column" key={quarter}><header><div><strong>{quarter}</strong><time>{months[Number(quarter[1]) - 1]}</time></div><span>{goals.length} {goals.length === 1 ? "outcome" : "outcomes"}</span></header><div className="quarter-cards">{goals.length ? goals.map((goal) => <GoalCard key={goal.id} goal={goal} projects={snapshot.projects}/>) : <div className="column-empty"><strong>Nothing planned yet</strong><span>{quarter} outcomes will appear here after planning</span></div>}</div></section> })}</main></>;
}
