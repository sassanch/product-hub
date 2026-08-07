import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GoalCard } from "@/components/goal-card";
import { demoSnapshot } from "@/lib/demo-data";

describe("GoalCard", () => {
  it("shows initiative status instead of its owner", () => {
    const goal = demoSnapshot.initiatives[0];
    render(<GoalCard goal={goal} projects={demoSnapshot.projects}/>);
    expect(screen.getByText(goal.status)).toBeTruthy();
    expect(screen.queryByText(goal.owner!)).toBeNull();
  });
});
