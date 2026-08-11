import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "../../components/common/Spinner";

describe("Spinner", () => {
  it("renders the default label", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<Spinner label="Fetching teams..." />);
    expect(screen.getByText("Fetching teams...")).toBeInTheDocument();
  });

  it("exposes role='status' for assistive tech", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("marks the region as an aria-live polite announcement", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});