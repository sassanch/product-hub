"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function DrawerFrame({ kicker, title, tagline, closeHref, children }: { kicker: string; title: string; tagline?: string | null; closeHref?: string; children: React.ReactNode }) {
  const router = useRouter();
  const close = () => closeHref ? router.push(closeHref) : router.back();
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (closeHref) router.push(closeHref);
      else router.back();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closeHref, router]);

  return <><button className="detail-backdrop" onClick={close} aria-label={`Close ${kicker.toLowerCase()}`}/><aside className="detail-drawer"><header className="drawer-head"><div><span className="drawer-kicker">{kicker}</span><h1>{title}</h1>{tagline?<p className="drawer-tagline">{tagline}</p>:null}</div><button className="drawer-close" onClick={close} aria-label="Close"><X size={19}/></button></header>{children}</aside></>;
}
