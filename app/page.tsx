import { AppShell } from "@/components/app-shell";
import { GoalCard } from "@/components/goal-card";
import { getRoadmapSnapshot } from "@/lib/linear";
import { currentQuarter,shiftQuarter,visibleInitiatives } from "@/lib/roadmap";

const months=["Jan – Mar","Apr – Jun","Jul – Sep","Oct – Dec"];
const quarterMonths=(q:string)=>months[Number(q[1])-1];

export default async function GoalsPage({searchParams}:{searchParams:Promise<{quarter?:string}>}) {
  const [{quarter},snapshot]=await Promise.all([searchParams,getRoadmapSnapshot()]);
  const selected=/^Q[1-4] \d{4}$/.test(quarter||"")?quarter!:currentQuarter();
  const quarters=[selected,shiftQuarter(selected,1),shiftQuarter(selected,2)];
  const counts=quarters.map(q=>visibleInitiatives(snapshot.initiatives,q).length);
  return <AppShell active="roadmap" snapshot={snapshot}><div className="context-bar"><div><strong>{quarters[0].replace(" ","–")} outcomes</strong><span>·</span><span>{counts[0]} this quarter</span><span>·</span><span>{counts[1]} next quarter</span></div><div className="health-key"><span><i className="green"/>On track</span><span><i className="amber"/>At risk</span><span><i className="red"/>Off track</span></div></div><main className="roadmap-board">{quarters.map(q=>{const goals=visibleInitiatives(snapshot.initiatives,q);return <section className="quarter-column" key={q}><header><div><strong>{q}</strong><time>{quarterMonths(q)}</time></div><span>{goals.length} {goals.length===1?"outcome":"outcomes"}</span></header><div className="quarter-cards">{goals.length?goals.map(goal=><GoalCard key={goal.id} goal={goal} projects={snapshot.projects}/>):<div className="column-empty"><strong>Nothing planned yet</strong><span>{q} outcomes will appear here after planning</span></div>}</div></section>})}</main><div className="quarter-switcher"><a href={`/?quarter=${encodeURIComponent(shiftQuarter(selected,-1))}`}>← Previous</a><a href={`/?quarter=${encodeURIComponent(shiftQuarter(selected,1))}`}>Next →</a></div></AppShell>;
}
