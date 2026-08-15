import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import TeamOverviewTab from "../../components/team/TeamOverviewTab";

// TeamOverviewTab is presentational and receives the already-fetched
// `team` object from TeamPage (no fetch of its own). Same empty-field-hides
// rule as elsewhere: missing optional fields are omitted, not "N/A"'d.

vi.mock("../../components/common/Collapsible", () => ({
  default: ({ isOpen, children }) => (
    <div data-testid="collapsible" data-open={isOpen}>
      {children}
    </div>
  ),
}));

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const fullTeam = {
  idTeam: "134946",
  strTeam: "Kansas City Chiefs",
  strTeamBadge: "https://example.com/chiefs-badge.png",
  strLeague: "NFL",
  strStadium: "GEHA Field at Arrowhead Stadium",
  intStadiumCapacity: "76416",
  intFormedYear: "1960",
  strDescriptionEN: "The Kansas City Chiefs are a professional team...",
};

describe("TeamOverviewTab", () => {
  it("renders the team badge and name", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} />);
    expect(
      screen.getByRole("heading", { name: "Kansas City Chiefs" })
    ).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      fullTeam.strTeamBadge
    );
  });

  it("renders a league link when strLeague is present, pointing at Home", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} />);
    const link = screen.getByRole("link", { name: "NFL" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("does not render a league link when strLeague is missing", () => {
    const { strLeague, ...teamWithoutLeague } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutLeague} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders stadium name and capacity when present", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} />);
    expect(
      screen.getByText(/GEHA Field at Arrowhead Stadium/)
    ).toBeInTheDocument();
    expect(screen.getByText(/76416/)).toBeInTheDocument();
  });

  it("does not render stadium info when strStadium is missing", () => {
    const { strStadium, ...teamWithoutStadium } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutStadium} />);
    expect(
      screen.queryByText(/GEHA Field at Arrowhead Stadium/)
    ).not.toBeInTheDocument();
  });

  it("renders the founded year when present", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} />);
    expect(screen.getByText(/1960/)).toBeInTheDocument();
  });

  it("does not render a founded year when intFormedYear is missing", () => {
    const { intFormedYear, ...teamWithoutFounded } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutFounded} />);
    expect(screen.queryByText(/Founded/)).not.toBeInTheDocument();
  });

  it("does not render a description toggle when strDescriptionEN is missing", () => {
    const { strDescriptionEN, ...teamWithoutDescription } = fullTeam;
    renderWithRouter(<TeamOverviewTab team={teamWithoutDescription} />);
    expect(
      screen.queryByRole("button", { name: /description/i })
    ).not.toBeInTheDocument();
  });

  it("renders a closed description toggle by default when strDescriptionEN is present", () => {
    renderWithRouter(<TeamOverviewTab team={fullTeam} />);
    expect(
      screen.getByRole("button", { name: /show description/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("collapsible")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  it("opens the description and relabels the toggle when clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TeamOverviewTab team={fullTeam} />);

    await user.click(screen.getByRole("button", { name: /show description/i }));

    expect(screen.getByTestId("collapsible")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(
      screen.getByRole("button", { name: /hide description/i })
    ).toBeInTheDocument();
  });

  it("closes the description again on a second click", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TeamOverviewTab team={fullTeam} />);

    const toggle = () => screen.getByRole("button", { name: /description/i });
    await user.click(toggle());
    await user.click(toggle());

    expect(screen.getByTestId("collapsible")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  it("renders without crashing when only required fields are present", () => {
    const minimalTeam = { idTeam: "1", strTeam: "Minimal FC" };
    expect(() =>
      renderWithRouter(<TeamOverviewTab team={minimalTeam} />)
    ).not.toThrow();
  });
});
