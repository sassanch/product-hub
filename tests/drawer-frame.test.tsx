import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DrawerFrame } from "@/components/drawer-frame";

const push = vi.fn();
const back = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, back }) }));

afterEach(() => {
  push.mockClear();
  back.mockClear();
});

describe("DrawerFrame", () => {
  it("behaves as a labeled modal and traps focus", () => {
    const { unmount } = render(<DrawerFrame kicker="Project" title="Feature flags" closeHref="/projects"><a href="/inside">Inside link</a></DrawerFrame>);
    const dialog = screen.getByRole("dialog", { name: "Feature flags" });
    const close = screen.getByRole("button", { name: "Close project" });
    const inside = screen.getByRole("link", { name: "Inside link" });

    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(inside);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(push).toHaveBeenCalledWith("/projects");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
