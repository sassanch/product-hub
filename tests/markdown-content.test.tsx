import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "@/components/markdown-content";

describe("MarkdownContent", () => {
  it("renders update formatting and safe external links", () => {
    const { container } = render(
      <MarkdownContent>{"## Key progress\n\n- **Build complete**\n- [Release notes](https://example.com)"}</MarkdownContent>,
    );

    expect(screen.getByRole("heading", { name: "Key progress" })).toBeTruthy();
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("Build complete").tagName).toBe("STRONG");
    expect(screen.getByRole("link", { name: "Release notes" }).getAttribute("target")).toBe("_blank");
  });
});
