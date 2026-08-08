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

  it("embeds standalone Figma mockups with a fallback link", () => {
    render(<MarkdownContent document>{"[Account flow](https://www.figma.com/design/abc123/Account-flow)"}</MarkdownContent>);

    const frame = screen.getByTitle("Embedded Figma mockup");
    expect(frame.getAttribute("src")).toContain("https://www.figma.com/embed?embed_host=share&url=");
    expect(screen.getByRole("link", { name: "Open mockup in Figma" }).getAttribute("href")).toBe("https://www.figma.com/design/abc123/Account-flow");
  });

  it("keeps inline and unsupported links in normal paragraphs", () => {
    const { container } = render(<MarkdownContent document>{"Review the [mockup](https://www.figma.com/design/abc123/Account-flow) and [notes](https://example.com)."}</MarkdownContent>);

    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("link", { name: "mockup" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "notes" })).toBeTruthy();
  });
});
