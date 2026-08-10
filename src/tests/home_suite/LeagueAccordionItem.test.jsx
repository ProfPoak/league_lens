import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LeagueAccordionItem from "../../components/home/LeagueAccordionItem";
import { useSportsDbFetch } from "../../hooks/useSportsDbFetch";

// LeagueAccordionItem owns: gating both fetches on `isOpen`, client-side
// filter state, and wiring data/status into presentational children. Every
// child component and the fetch hook are mocked so these tests only
// exercise LeagueAccordionItem's own logic, not the children's internals.

vi.mock("../../hooks/useSportsDbFetch", () => ({
  useSportsDbFetch: vi.fn(),
}));

vi.mock("../../components/common/Collapsible", () => ({
  default: ({ isOpen, children }) => (
    <div data-testid="collapsible" data-open={isOpen}>
      {children}
    </div>
  ),
}));

vi.mock("../../components/common/FilterInput", () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid="filter-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("../../components/common/Spinner", () => ({
  default: () => <div data-testid="spinner" />,
}));

vi.mock("../../components/common/EmptyState", () => ({
  default: ({ message }) => <div data-testid="empty-state">{message}</div>,
}));

vi.mock("../../components/home/TeamListItem", () => ({
  default: ({ team }) => <div data-testid="team-item">{team.strTeam}</div>,
}));

vi.mock("../../components/home/LeagueSchedulePreview", () => ({
  default: ({ data, status }) => (
    <div data-testid="schedule-preview" data-status={status}>
      {data ? "has-data" : "no-data"}
    </div>
  ),
}));

const league = {
  id: 4391,
  apiName: "NFL",
  name: "NFL",
  sport: "Football",
  level: "Professional",
};

const idleResult = { data: null, status: "idle", error: null, isLoading: false };

// Routes each useSportsDbFetch() call to a teams-shaped or schedule-shaped
// result based on the URL its buildUrl() produces, since the component
// calls the (mocked) hook twice per render with two different builders.
function stubFetch({ teams = idleResult, schedule = idleResult } = {}) {
  useSportsDbFetch.mockImplementation((buildUrl) => {
    const url = buildUrl();
    if (!url) return idleResult;
    if (url.includes("search_all_teams")) return teams;
    if (url.includes("eventsnextleague")) return schedule;
    return idleResult;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  stubFetch();
});

describe("LeagueAccordionItem", () => {
  it("renders the league name as the toggle button", () => {
    render(<LeagueAccordionItem league={league} isOpen={false} onToggle={() => {}} />);
    expect(screen.getByRole("button", { name: league.name })).toBeInTheDocument();
  });

  it("reflects isOpen via aria-expanded", () => {
    const { rerender } = render(
      <LeagueAccordionItem league={league} isOpen={false} onToggle={() => {}} />
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");

    rerender(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onToggle when the header button is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<LeagueAccordionItem league={league} isOpen={false} onToggle={onToggle} />);

    await user.click(screen.getByRole("button", { name: league.name }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("does not request teams or schedule data while closed", () => {
    render(<LeagueAccordionItem league={league} isOpen={false} onToggle={() => {}} />);

    // Every buildUrl passed to the hook should resolve to null while closed
    useSportsDbFetch.mock.calls.forEach(([buildUrl]) => {
      expect(buildUrl()).toBeNull();
    });
  });

  it("does not render panel content while closed", () => {
    render(<LeagueAccordionItem league={league} isOpen={false} onToggle={() => {}} />);
    expect(screen.queryByTestId("filter-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("team-item")).not.toBeInTheDocument();
  });

  it("requests teams for the league's apiName and schedule for the league's id when open", () => {
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);

    const urls = useSportsDbFetch.mock.calls.map(([buildUrl]) => buildUrl());
    expect(urls.some((u) => u?.includes(`l=${league.apiName}`))).toBe(true);
    expect(urls.some((u) => u?.includes(`id=${league.id}`))).toBe(true);
  });

  it("shows a spinner while teams are loading", () => {
    stubFetch({ teams: { ...idleResult, status: "loading", isLoading: true } });
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows an error empty state when the teams fetch fails", () => {
    stubFetch({ teams: { ...idleResult, status: "error", error: new Error("boom") } });
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Couldn't load teams.");
  });

  it("treats a null teams payload as an empty list, not a crash", () => {
    stubFetch({ teams: { ...idleResult, status: "success", data: { teams: null } } });

    expect(() =>
      render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />)
    ).not.toThrow();

    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No teams match your filter."
    );
  });

  it("renders one TeamListItem per team on success", () => {
    stubFetch({
      teams: {
        ...idleResult,
        status: "success",
        data: {
          teams: [
            { idTeam: "1", strTeam: "Chiefs" },
            { idTeam: "2", strTeam: "Bills" },
          ],
        },
      },
    });
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);

    expect(screen.getAllByTestId("team-item")).toHaveLength(2);
    expect(screen.getByText("Chiefs")).toBeInTheDocument();
    expect(screen.getByText("Bills")).toBeInTheDocument();
  });

  it("filters the visible team list client-side as the filter input changes", async () => {
    const user = userEvent.setup();
    stubFetch({
      teams: {
        ...idleResult,
        status: "success",
        data: {
          teams: [
            { idTeam: "1", strTeam: "Chiefs" },
            { idTeam: "2", strTeam: "Bills" },
          ],
        },
      },
    });
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);

    await user.type(screen.getByTestId("filter-input"), "chi");

    expect(screen.getByText("Chiefs")).toBeInTheDocument();
    expect(screen.queryByText("Bills")).not.toBeInTheDocument();
  });

  it("filter matching is case-insensitive", async () => {
    const user = userEvent.setup();
    stubFetch({
      teams: {
        ...idleResult,
        status: "success",
        data: { teams: [{ idTeam: "1", strTeam: "Chiefs" }] },
      },
    });
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);

    await user.type(screen.getByTestId("filter-input"), "CHIEFS");
    expect(screen.getByText("Chiefs")).toBeInTheDocument();
  });

  it("shows a 'no matches' empty state when the filter excludes every team", async () => {
    const user = userEvent.setup();
    stubFetch({
      teams: {
        ...idleResult,
        status: "success",
        data: { teams: [{ idTeam: "1", strTeam: "Chiefs" }] },
      },
    });
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);

    await user.type(screen.getByTestId("filter-input"), "zzz");
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No teams match your filter."
    );
  });

  it("passes schedule data and status through to LeagueSchedulePreview", () => {
    stubFetch({
      teams: { ...idleResult, status: "success", data: { teams: [] } },
      schedule: { ...idleResult, status: "success", data: { events: [] } },
    });
    render(<LeagueAccordionItem league={league} isOpen={true} onToggle={() => {}} />);

    const preview = screen.getByTestId("schedule-preview");
    expect(preview).toHaveAttribute("data-status", "success");
    expect(preview).toHaveTextContent("has-data");
  });
});