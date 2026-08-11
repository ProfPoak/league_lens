import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "../../pages/HomePage";

vi.mock("../../components/home/LeagueAccordion", () => ({
  default: () => <div data-testid="league-accordion" />,
}));

describe("HomePage", () => {
  it("renders the app title", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "League Lens", level: 1 })).toBeInTheDocument();
  });

  it("renders the instructional subheading", () => {
    render(<HomePage />);
    expect(
      screen.getByText("Pick a league to view teams and upcoming games")
    ).toBeInTheDocument();
  });

  it("renders the LeagueAccordion", () => {
    render(<HomePage />);
    expect(screen.getByTestId("league-accordion")).toBeInTheDocument();
  });
});