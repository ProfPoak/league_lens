import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Collapsible from "../../components/common/Collapsible";

describe("Collapsible", () => {
  it("renders children in the DOM when isOpen is true", () => {
    render(
      <Collapsible isOpen={true}>
        <p>panel content</p>
      </Collapsible>
    );

    expect(screen.getByText("panel content")).toBeInTheDocument();
  });

  it("still renders children in the DOM when isOpen is false", () => {
    // Content stays mounted (visually hidden via CSS later) — this is
    // deliberate so fetched/loaded content isn't lost on collapse.
    render(
      <Collapsible isOpen={false}>
        <p>panel content</p>
      </Collapsible>
    );

    expect(screen.getByText("panel content")).toBeInTheDocument();
  });

  it("applies an --open modifier class when isOpen is true", () => {
    const { container } = render(
      <Collapsible isOpen={true}>
        <p>panel content</p>
      </Collapsible>
    );

    expect(container.firstChild).toHaveClass("collapsible--open");
  });

  it("does not apply the --open modifier class when isOpen is false", () => {
    const { container } = render(
      <Collapsible isOpen={false}>
        <p>panel content</p>
      </Collapsible>
    );

    expect(container.firstChild).not.toHaveClass("collapsible--open");
  });

  it("renders without crashing when given no children", () => {
    expect(() => render(<Collapsible isOpen={false} />)).not.toThrow();
  });
});