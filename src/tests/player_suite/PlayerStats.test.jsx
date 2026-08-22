import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlayerStats from "../../components/player/PlayerStats";
import { useSportsDbFetch } from "../../hooks/useSportsDbFetch";


vi.mock("../../hooks/useSportsDbFetch", () => ({
  useSportsDbFetch: vi.fn(),
}));

vi.mock("../../components/common/Spinner", () => ({
  default: () => <div data-testid="spinner" />,
}));

vi.mock("../../components/common/EmptyState", () => ({
  default: ({ message }) => <div data-testid="empty-state">{message}</div>,
}));

const idleResult = { data: null, status: "idle", error: null, isLoading: false };

function stubFetch(result) {
  useSportsDbFetch.mockImplementation((buildUrl) => {
    const url = buildUrl();
    if (!url) return idleResult;
    return result;
  });
}

const mahomes2023Passing = {
  strSeason: "2023",
  strLeague: "NFL",
  strTeam: "Kansas City Chiefs",
  strStatistic: "Passing Yards",
  strValue: "4183",
};

const mahomes2023TD = {
  strSeason: "2023",
  strLeague: "NFL",
  strTeam: "Kansas City Chiefs",
  strStatistic: "Touchdowns",
  strValue: "27",
};

const mahomes2022Passing = {
  strSeason: "2022",
  strLeague: "NFL",
  strTeam: "Kansas City Chiefs",
  strStatistic: "Passing Yards",
  strValue: "5250",
};

beforeEach(() => {
  vi.clearAllMocks();
  stubFetch(idleResult);
});

describe("PlayerStats", () => {
  it("requests stats using the player's id", () => {
    render(<PlayerStats playerId="34145938" />);
    const [[buildUrl]] = useSportsDbFetch.mock.calls;
    expect(buildUrl()).toContain("lookupplayerstats");
    expect(buildUrl()).toContain("34145938");
  });

  it("shows a spinner while loading", () => {
    stubFetch({ ...idleResult, status: "loading", isLoading: true });
    render(<PlayerStats playerId="34145938" />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", () => {
    stubFetch({ ...idleResult, status: "error", error: new Error("boom") });
    render(<PlayerStats playerId="34145938" />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "Couldn't load stats."
    );
  });

  it("shows a 'no stats' message on success when the stats payload is null", () => {
    stubFetch({ ...idleResult, status: "success", data: { playerstats: null } });
    render(<PlayerStats playerId="34145938" />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No stats available for this player."
    );
  });

  it("shows a 'no stats' message on success when the stats array is empty", () => {
    stubFetch({ ...idleResult, status: "success", data: { playerstats: [] } });
    render(<PlayerStats playerId="34145938" />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No stats available for this player."
    );
  });

  it("renders a Stats heading when stats are present", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: { playerstats: [mahomes2023Passing] },
    });
    render(<PlayerStats playerId="34145938" />);
    expect(screen.getByText("Stats")).toBeInTheDocument();
  });

  it("groups multiple stat entries from the same season+league into a single row", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: { playerstats: [mahomes2023Passing, mahomes2023TD] },
    });
    render(<PlayerStats playerId="34145938" />);

    expect(screen.getAllByTestId("stat-row")).toHaveLength(1);
  });

  it("renders one row per distinct season+league", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: { playerstats: [mahomes2023Passing, mahomes2022Passing] },
    });
    render(<PlayerStats playerId="34145938" />);

    expect(screen.getAllByTestId("stat-row")).toHaveLength(2);
  });

  it("renders season and league values in each row", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: { playerstats: [mahomes2023Passing] },
    });
    render(<PlayerStats playerId="34145938" />);

    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("NFL")).toBeInTheDocument();
  });

  it("renders a column header per distinct strStatistic and the matching value", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: { playerstats: [mahomes2023Passing, mahomes2023TD] },
    });
    render(<PlayerStats playerId="34145938" />);

    expect(screen.getByText("Passing Yards")).toBeInTheDocument();
    expect(screen.getByText("Touchdowns")).toBeInTheDocument();
    expect(screen.getByText("4183")).toBeInTheDocument();
    expect(screen.getByText("27")).toBeInTheDocument();
  });

  it("renders an em dash for a stat column a given season/league didn't report", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      // 2023 has Touchdowns, 2022 doesn't -> 2022's row should show a
      // placeholder in that column rather than an empty cell or a crash
      data: { playerstats: [mahomes2023TD, mahomes2022Passing] },
    });
    render(<PlayerStats playerId="34145938" />);

    const rows = screen.getAllByTestId("stat-row");
    expect(rows).toHaveLength(2);
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("orders rows most-recent-season first", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: { playerstats: [mahomes2022Passing, mahomes2023Passing] },
    });
    render(<PlayerStats playerId="34145938" />);

    const rows = screen.getAllByTestId("stat-row");
    expect(rows[0]).toHaveTextContent("2023");
    expect(rows[1]).toHaveTextContent("2022");
  });

  it("does not crash when the fetch has not resolved yet", () => {
    expect(() => render(<PlayerStats playerId="34145938" />)).not.toThrow();
  });
});
