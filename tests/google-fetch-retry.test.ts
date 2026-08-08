import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithRetry } from "@/lib/google-sheets";

describe("Google request retries", () => {
  afterEach(() => vi.restoreAllMocks());

  it("recovers from a transient network failure", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    const response = await fetchWithRetry("https://google.example", undefined, 3, 0);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries a transient upstream status", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    const response = await fetchWithRetry("https://google.example", undefined, 3, 0);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
