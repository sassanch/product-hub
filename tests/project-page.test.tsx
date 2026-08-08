import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectPage } from "@/components/project-page";
import { demoSnapshot } from "@/lib/demo-data";

afterEach(cleanup);

describe("ProjectPage", () => {
  it("renders project details and the full Markdown document", () => {
    const { container } = render(<ProjectPage project={demoSnapshot.projects[0]}/>);
    const page = within(container);

    expect(page.getAllByRole("heading", { name: "Game notifications", level: 1 })).toHaveLength(2);
    expect(page.getByRole("heading", { name: "Problem" })).toBeTruthy();
    expect(page.getByText("Latest update")).toBeTruthy();
    expect(page.getByText("Phase")).toBeTruthy();
    expect(page.getByText("Shaping")).toBeTruthy();
    expect(page.getByText("Build start")).toBeTruthy();
    expect(within(page.getByText("Build start").parentElement as HTMLElement).getByText("Aug 3, 2026")).toBeTruthy();
    expect(page.getByText("Target completion")).toBeTruthy();
    expect(page.getAllByText("Sep 12, 2026").length).toBeGreaterThan(0);
    expect(page.queryByText("On track")).toBeNull();
    expect(page.getByRole("link", { name: "Back to projects" }).getAttribute("href")).toBe("/");
  });

  it("renders an empty state when the sheet has no document", () => {
    render(<ProjectPage project={{ ...demoSnapshot.projects[0], descriptionMarkdown: null }}/>);

    expect(screen.getByText("No project description yet")).toBeTruthy();
  });
});
