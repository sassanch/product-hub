"use client";

import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";

const DRAG_THRESHOLD = 5;

export function DragScrollBoard({ children }: { children: ReactNode }) {
  const boardRef = useRef<HTMLElement>(null);
  const drag = useRef({ pointerId: -1, startX: 0, startY: 0, scrollLeft: 0, active: false });
  const suppressClick = useRef(false);

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const board = event.currentTarget;
    suppressClick.current = false;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: board.scrollLeft,
      active: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const state = drag.current;
    if (state.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;

    if (!state.active) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
      state.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add("is-drag-scrolling");
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = state.scrollLeft - deltaX;
  }

  function finishDrag(event: PointerEvent<HTMLElement>) {
    if (drag.current.pointerId !== event.pointerId) return;

    suppressClick.current = drag.current.active;
    drag.current.pointerId = -1;
    drag.current.active = false;
    event.currentTarget.classList.remove("is-drag-scrolling");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }

  return (
    <main
      ref={boardRef}
      className="projects-board drag-scroll-board"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClickCapture={handleClick}
    >
      {children}
    </main>
  );
}
