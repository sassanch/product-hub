"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function DrawerFrame({ kicker, title, tagline, closeHref, children }: { kicker: string; title: string; tagline?: string | null; closeHref?: string; children: React.ReactNode }) {
  const router = useRouter();
  const drawerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const close = useCallback(() => closeHref ? router.push(closeHref) : router.back(), [closeHref, router]);

  useEffect(() => {
    const drawer = drawerRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const parent = drawer?.parentElement;
    const appShell = document.querySelector<HTMLElement>(".app-shell");
    const backgroundRoot = appShell && drawer && !appShell.contains(drawer) ? [appShell] : parent ? Array.from(parent.children) : [];
    const backgroundElements = backgroundRoot.filter((element): element is HTMLElement => element instanceof HTMLElement && element !== drawer && element !== backdropRef.current && element.tagName !== "SCRIPT");
    const backgroundState = backgroundElements.map((element) => ({ element, inert: element.hasAttribute("inert"), ariaHidden: element.getAttribute("aria-hidden") }));
    const previousOverflow = document.body.style.overflow;

    backgroundElements.forEach((element) => {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute("hidden"));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      backgroundState.forEach(({ element, inert, ariaHidden }) => {
        if (!inert) element.removeAttribute("inert");
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [close]);

  return <><button ref={backdropRef} className="detail-backdrop" onClick={close} aria-hidden="true" tabIndex={-1}/><aside ref={drawerRef} className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={tagline ? descriptionId : undefined}><header className="drawer-head"><div><span className="drawer-kicker">{kicker}</span><h1 id={titleId}>{title}</h1>{tagline?<p id={descriptionId} className="drawer-tagline">{tagline}</p>:null}</div><button ref={closeButtonRef} className="drawer-close" onClick={close} aria-label={`Close ${kicker.toLowerCase()}`}><X size={19}/></button></header>{children}</aside></>;
}
