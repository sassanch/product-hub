import { describe, expect, it } from "vitest";
import { demoSnapshot } from "@/lib/demo-data";
import { publicRoadmapSnapshot } from "@/lib/public-roadmap";

describe("publicRoadmapSnapshot", () => {
  it("publishes only visible records and card-level fields", () => {
    const privateProject = { ...demoSnapshot.projects[0], id: "private", status: "Canceled" };
    const payload = publicRoadmapSnapshot({ ...demoSnapshot, projects: [...demoSnapshot.projects, privateProject] });

    expect(payload.projects.some((project) => project.id === privateProject.id)).toBe(false);
    expect(Object.keys(payload.initiatives[0]).sort()).toEqual(["health", "id", "name", "status", "summary", "targetDate"]);
    expect(Object.keys(payload.projects[0]).sort()).toEqual(["health", "id", "initiativeIds", "name", "priority", "status", "summary", "targetDate"]);
  });
});
