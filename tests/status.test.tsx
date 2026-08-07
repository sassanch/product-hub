import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RelativeUpdate } from "@/components/status";

describe("RelativeUpdate", () => {
  it("preserves the Sheet calendar date without a timezone shift", () => {
    render(<RelativeUpdate value="2026-08-06T00:00:00.000Z"/>);
    expect(screen.getByText("Aug 6, 2026")).toBeTruthy();
  });
});
