import Link from "next/link";
import { Compass, Globe2 } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="shell"><header className="topbar"><Link className="brand" href="/"><span className="brand-mark"><Compass size={20}/></span><span>Plei Outcomes</span></Link><div className="top-actions"><Globe2 size={16}/><span>Public product roadmap</span></div></header>{children}</div>;
}
