import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Badge from "../../components/common/Badge";

describe("Badge", () => {
  it("renders nothing when result is null", () => {
    const { container } = render(<Badge result={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when result is undefined", () => {
    const { container } = render(<Badge result={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the result text when given a value", () => {
    render(<Badge result="W" />);
    expect(screen.getByText("W")).toBeInTheDocument();
  });

  it("applies a lowercase result modifier class", () => {
    render(<Badge result="W" />);
    expect(screen.getByText("W")).toHaveClass("badge--w");
  });

  it("lowercases the modifier class regardless of input casing", () => {
    render(<Badge result="L" />);
    expect(screen.getByText("L")).toHaveClass("badge--l");
  });

  it("renders a draw result correctly", () => {
    render(<Badge result="D" />);
    expect(screen.getByText("D")).toHaveClass("badge--d");
  });
});