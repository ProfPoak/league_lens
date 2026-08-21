import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MatchRow from "../../components/team/MatchRow";

// MatchRow is mocked everywhere it's consumed (TeamScheduleCard tests),
// so its own date formatting, score display, and mode-gated behavior
// need direct coverage here. getMatchResult and formatEventDateTime are
// mocked so this only exercises MatchRow's own rendering logic.

vi.mock("../../utils/formatters", () => ({
  formatEventDateTime: () => "Sat, Aug 22 · 1:00 PM",
}));

vi.mock("../../utils/match", () => ({
  getMatchResult: vi.fn(() => "W"),
}));

vi.mock("../../components/common/Badge", () => ({
  default: ({ result }) => <span data-testid="badge">{result}</span>,
}));

import { getMatchResult } from "../../utils/match";

const upcomingEvent = {
  idEvent: "1",
  strHomeTeam: "Chiefs",
  strAwayTeam: "Bills",
};

const pastEvent = {
  idEvent: "2",
  idHomeTeam: "134946",
  idAwayTeam: "134942",
  strHomeTeam: "Chiefs",
  strAwayTeam: "Broncos",
  intHomeScore: 24,
  intAwayScore: 10,
};

describe("MatchRow", () => {
  it("renders the formatted date", () => {
    render(<MatchRow event={upcomingEvent} teamId="134946" mode="upcoming" />);
    expect(screen.getByText("Sat, Aug 22 · 1:00 PM")).toBeInTheDocument();
  });

  it("renders the matchup as home vs away", () => {
    render(<MatchRow event={upcomingEvent} teamId="134946" mode="upcoming" />);
    expect(screen.getByText("Chiefs vs Bills")).toBeInTheDocument();
  });

  it("does not render a score in upcoming mode", () => {
    render(<MatchRow event={upcomingEvent} teamId="134946" mode="upcoming" />);
    expect(screen.queryByText(/\d+-\d+/)).not.toBeInTheDocument();
  });

  it("does not render a Badge in upcoming mode", () => {
    render(<MatchRow event={upcomingEvent} teamId="134946" mode="upcoming" />);
    expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
  });

  it("does not call getMatchResult in upcoming mode", () => {
    render(<MatchRow event={upcomingEvent} teamId="134946" mode="upcoming" />);
    expect(getMatchResult).not.toHaveBeenCalled();
  });

  it("renders the score in past mode", () => {
    render(<MatchRow event={pastEvent} teamId="134946" mode="past" />);
    expect(screen.getByText("24-10")).toBeInTheDocument();
  });

  it("renders a Badge with the match result in past mode", () => {
    render(<MatchRow event={pastEvent} teamId="134946" mode="past" />);
    expect(screen.getByTestId("badge")).toHaveTextContent("W");
  });

  it("calls getMatchResult with the event and teamId in past mode", () => {
    render(<MatchRow event={pastEvent} teamId="134946" mode="past" />);
    expect(getMatchResult).toHaveBeenCalledWith(pastEvent, "134946");
  });
});