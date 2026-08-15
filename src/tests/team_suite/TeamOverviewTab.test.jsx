import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import TeamOverviewTab from "../../components/team/TeamOverviewTab";

// TeamOverviewTab remains presentational for the `team` object (still
// passed down, still fetched once by TeamPage). It now also forwards
// `teamId` straight through to TeamScheduleCard, which owns its own
// fetches — TeamOverviewTab itself still fetches nothing.
//
// CHANGED from the original suite:
// - description now defaults OPEN (was closed) — the tab felt too sparse
//   otherwise, since it's the fallback content before Roster loads.
// - TeamScheduleCard renders unconditionally under the description,
//   regardless of whether strDescriptionEN is present.

vi.mock("../../components/common/Collapsible", () => ({
  default: ({ isOpen, children }) => (
    <div data-testid="collapsible" data-open={isOpen}>
      {children}
    </div>
  ),
}));

vi.mock("../../components/team/TeamScheduleCard", () => ({
  default: ({ teamId }) => <div data-testid="schedule-card">{teamId}</div>,
}));

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const fullTeam = {
  idTeam: "134946",
  strTeam: "Kansas City Chiefs",
  strBadge: "https://example.com/chiefs-badge.png",
  strLeague: "NFL",
  strStadium: "GEHA Field at Arrowhead Stadium",
  intStadiumCapacity: "76416",
  intFormedYear: "1960",
  strDescriptionEN: "The Kansas City Chiefs are a professional team...",
};

describe("TeamOverviewTab", () => {
  it("renders the team badge and name", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);
    expect(screen.getByRole("heading", { name: "Kansas City Chiefs" })).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", fullTeam.strBadge);
  });

  it("renders a league link when strLeague is present, pointing at Home", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);
    expect(screen.getByRole("link", { name: "NFL" })).toHaveAttribute("href", "/");
  });

  it("does not render a league link when strLeague is missing", () => {
    const { strLeague, ...teamWithoutLeague } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutLeague} teamId="134946" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders stadium name and capacity when present", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);
    expect(screen.getByText(/GEHA Field at Arrowhead Stadium/)).toBeInTheDocument();
    expect(screen.getByText(/76416/)).toBeInTheDocument();
  });

  it("does not render stadium info when strStadium is missing", () => {
    const { strStadium, ...teamWithoutStadium } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutStadium} teamId="134946" />);
    expect(screen.queryByText(/GEHA Field at Arrowhead Stadium/)).not.toBeInTheDocument();
  });

  it("renders the founded year when present", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);
    expect(screen.getByText(/1960/)).toBeInTheDocument();
  });

  it("does not render a founded year when intFormedYear is missing", () => {
    const { intFormedYear, ...teamWithoutFounded } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutFounded} teamId="134946" />);
    expect(screen.queryByText(/Founded/)).not.toBeInTheDocument();
  });

  it("does not render a description toggle when strDescriptionEN is missing", () => {
    const { strDescriptionEN, ...teamWithoutDescription } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutDescription} teamId="134946" />);
    expect(screen.queryByRole("button", { name: /description/i })).not.toBeInTheDocument();
  });

  it("renders an OPEN description toggle by default when strDescriptionEN is present", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);
    expect(screen.getByRole("button", { name: /hide description/i })).toBeInTheDocument();
    expect(screen.getByTestId("collapsible")).toHaveAttribute("data-open", "true");
  });

  it("closes the description and relabels the toggle when clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);

    await user.click(screen.getByRole("button", { name: /hide description/i }));

    expect(screen.getByTestId("collapsible")).toHaveAttribute("data-open", "false");
    expect(screen.getByRole("button", { name: /show description/i })).toBeInTheDocument();
  });

  it("reopens the description on a second click", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);

    const toggle = () => screen.getByRole("button", { name: /description/i });
    await user.click(toggle());
    await user.click(toggle());

    expect(screen.getByTestId("collapsible")).toHaveAttribute("data-open", "true");
  });

  it("renders TeamScheduleCard with the team's id", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} teamId="134946" />);
    expect(screen.getByTestId("schedule-card")).toHaveTextContent("134946");
  });

  it("renders TeamScheduleCard even when strDescriptionEN is missing", () => {
    const { strDescriptionEN, ...teamWithoutDescription } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutDescription} teamId="134946" />);
    expect(screen.getByTestId("schedule-card")).toBeInTheDocument();
  });

  it("renders without crashing when only required fields are present", () => {
    const minimalTeam = { idTeam: "1", strTeam: "Minimal FC" };
    expect(() =>
      renderWithRouter(<TeamOverviewTab team={minimalTeam} teamId="1" />)
    ).not.toThrow();
  });
});