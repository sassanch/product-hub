import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Link from "next/link";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DragScrollBoard } from "@/components/drag-scroll-board";

afterEach(cleanup);

function mousePointer(type: string, clientX: number, clientY: number) {
  const event = new MouseEvent(type, { bubbles: true, button: 0, clientX, clientY });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: "mouse" },
  });
  return event;
}

describe("DragScrollBoard", () => {
  it("scrolls horizontally when dragged with the mouse", () => {
    render(<DragScrollBoard><span>Board content</span></DragScrollBoard>);
    const board = screen.getByText("Board content").parentElement as HTMLElement;
    board.scrollLeft = 120;
    board.setPointerCapture = vi.fn();
    board.hasPointerCapture = vi.fn(() => true);
    board.releasePointerCapture = vi.fn();

    fireEvent(board, mousePointer("pointerdown", 200, 20));
    fireEvent(board, mousePointer("pointermove", 150, 22));

    expect(board.scrollLeft).toBe(170);
    expect(board.classList.contains("is-drag-scrolling")).toBe(true);

    fireEvent(board, mousePointer("pointerup", 150, 22));
    expect(board.classList.contains("is-drag-scrolling")).toBe(false);
  });

  it("does not turn a click-sized movement into a drag", () => {
    let clickWasPrevented = false;
    render(<DragScrollBoard><Link href="/projects/example" onClick={(event) => { clickWasPrevented = event.defaultPrevented; event.preventDefault(); }}>Board content</Link></DragScrollBoard>);
    const link = screen.getByRole("link", { name: "Board content" });
    const board = link.parentElement as HTMLElement;
    board.scrollLeft = 120;
    board.setPointerCapture = vi.fn();

    fireEvent(link, mousePointer("pointerdown", 200, 20));
    fireEvent(link, mousePointer("pointermove", 198, 20));
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    fireEvent(link, click);

    expect(board.scrollLeft).toBe(120);
    expect(board.classList.contains("is-drag-scrolling")).toBe(false);
    expect(board.setPointerCapture).not.toHaveBeenCalled();
    expect(clickWasPrevented).toBe(false);
  });
});
