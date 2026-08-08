import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const roadmapMock = vi.fn();

vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("@/lib/google-sheets", () => ({ getRoadmapSnapshot: roadmapMock }));

describe("roadmap API authentication", () => {
  beforeEach(() => {
    authMock.mockReset();
    roadmapMock.mockReset();
  });

  it("returns 401 without reading roadmap data when no session exists", async () => {
    authMock.mockResolvedValue(null);
    const { GET } = await import("@/app/api/roadmap/route");

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(roadmapMock).not.toHaveBeenCalled();
  });
});
