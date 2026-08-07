import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectsView } from "@/components/projects-view";
import { demoSnapshot } from "@/lib/demo-data";

describe("ProjectsView", () => {
  it("omits project status columns with no visible projects", () => {
    const shaping = { ...demoSnapshot.projects[0], status: "Shaping", teamNames: ["Product"] };
    render(<ProjectsView snapshot={{ ...demoSnapshot, projects: [shaping] }}/>);

    expect(screen.getByText("Shaping")).toBeTruthy();
    expect(screen.queryByText("Planned")).toBeNull();
    expect(screen.queryByText("Ready")).toBeNull();
  });
});
