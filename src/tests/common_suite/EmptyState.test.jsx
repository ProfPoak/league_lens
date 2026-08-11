import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EmptyState from "../../components/common/EmptyState";

describe("EmptyState", () => {
  it("renders the default message when no message prop is given", () => {
    render(<EmptyState />);
    expect(screen.getByText("Nothing to show here.")).toBeInTheDocument();
  });

  it("renders a custom message when provided", () => {
    render(<EmptyState message="No teams match your filter." />);
    expect(screen.getByText("No teams match your filter.")).toBeInTheDocument();
  });

  it("applies the empty-state class to its container", () => {
    const { container } = render(<EmptyState message="Nothing here" />);
    expect(container.firstChild).toHaveClass("empty-state");
  });
});