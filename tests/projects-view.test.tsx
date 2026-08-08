import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectsView } from "@/components/projects-view";
import { demoSnapshot } from "@/lib/demo-data";

afterEach(cleanup);

describe("ProjectsView", () => {
  it("omits project status columns with no visible projects", () => {
    const shaping = { ...demoSnapshot.projects[0], status: "Shaping", teamNames: ["Product"] };
    render(<ProjectsView snapshot={{ ...demoSnapshot, projects: [shaping] }}/>);

    expect(screen.getByText("Shaping")).toBeTruthy();
    expect(screen.queryByText("Planned")).toBeNull();
    expect(screen.queryByText("Ready")).toBeNull();
  });

  it("links project cards to the full project route", () => {
    const shaping = { ...demoSnapshot.projects[0], status: "Shaping", teamNames: ["Product"] };
    const { container } = render(<ProjectsView snapshot={{ ...demoSnapshot, projects: [shaping] }}/>);

    expect(within(container).getByRole("link", { name: /Game notifications/ }).getAttribute("href")).toBe("/projects/notifications");
  });
});
