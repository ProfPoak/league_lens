import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import LeagueAccordion from "../../components/home/LeagueAccordion";
import { LEAGUES } from "../../utils/leagues";

// LeagueAccordion owns exactly one piece of state: which league id is
// active. It should NOT know about fetching, filtering, or team data.
// LeagueAccordionItem is mocked so these tests only exercise the parent's
// single-expand logic, not the child's internals.

vi.mock("../../components/home/LeagueAccordionItem", () => ({
  default: ({ league, isOpen, onToggle }) => (
    <div>
      <button onClick={onToggle}>{league?.name}</button>
      <span data-testid={`state-${league?.id}`}>
        {isOpen ? "open" : "closed"}
      </span>
    </div>
  ),
}));

describe("LeagueAccordion", () => {
  it("renders one item per league in LEAGUES", () => {
    render(<LeagueAccordion />);

    LEAGUES.forEach((league) => {
      expect(screen.getByText(league.name)).toBeInTheDocument();
    });
  });

  it("renders all leagues closed by default", () => {
    render(<LeagueAccordion />);

    LEAGUES.forEach((league) => {
      expect(screen.getByTestId(`state-${league.id}`)).toHaveTextContent(
        "closed"
      );
    });
  });

  it("opens a league when its header is clicked", async () => {
    const user = userEvent.setup();
    render(<LeagueAccordion />);

    const first = LEAGUES[0];
    await user.click(screen.getByText(first.name));

    expect(screen.getByTestId(`state-${first.id}`)).toHaveTextContent("open");
  });

  it("closes the previously open league when a different one is opened", async () => {
    const user = userEvent.setup();
    render(<LeagueAccordion />);

    const [first, second] = LEAGUES;

    await user.click(screen.getByText(first.name));
    expect(screen.getByTestId(`state-${first.id}`)).toHaveTextContent("open");

    await user.click(screen.getByText(second.name));

    expect(screen.getByTestId(`state-${first.id}`)).toHaveTextContent(
      "closed"
    );
    expect(screen.getByTestId(`state-${second.id}`)).toHaveTextContent(
      "open"
    );
  });

  it("closes an open league when its own header is clicked again", async () => {
    const user = userEvent.setup();
    render(<LeagueAccordion />);

    const first = LEAGUES[0];

    await user.click(screen.getByText(first.name));
    expect(screen.getByTestId(`state-${first.id}`)).toHaveTextContent("open");

    await user.click(screen.getByText(first.name));
    expect(screen.getByTestId(`state-${first.id}`)).toHaveTextContent(
      "closed"
    );
  });

  it("only ever has a single league open at once, regardless of click order", async () => {
    const user = userEvent.setup();
    render(<LeagueAccordion />);

    for (const league of LEAGUES) {
      await user.click(screen.getByText(league.name));

      const openCount = LEAGUES.filter(
        (l) =>
          screen.getByTestId(`state-${l.id}`).textContent === "open"
      ).length;

      expect(openCount).toBe(1);
    }
  });
});