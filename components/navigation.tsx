import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shiftQuarter } from "@/lib/roadmap";

export function Navigation({ active, quarter }: { active:"goals"|"projects"; quarter:string }) {
  return <div className="toolbar"><nav className="tabs" aria-label="Roadmap views"><Link className={`tab ${active==="goals"?"active":""}`} href={`/?quarter=${encodeURIComponent(quarter)}`}>Goals</Link><Link className={`tab ${active==="projects"?"active":""}`} href={`/projects?quarter=${encodeURIComponent(quarter)}`}>Projects</Link></nav><nav className="quarter-nav" aria-label="Quarter navigation"><Link aria-label="Previous quarter" href={`${active==="goals"?"/":"/projects"}?quarter=${encodeURIComponent(shiftQuarter(quarter,-1))}`}><ChevronLeft size={18}/></Link><span className="quarter-label">{quarter}</span><Link aria-label="Next quarter" href={`${active==="goals"?"/":"/projects"}?quarter=${encodeURIComponent(shiftQuarter(quarter,1))}`}><ChevronRight size={18}/></Link></nav></div>;
}
