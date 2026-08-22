import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlayerStats from "../../components/player/PlayerStats";
import { useSportsDbFetch } from "../../hooks/useSportsDbFetch";

// PlayerStats is a self-contained fetcher, but it differs from every other
// fetcher in the app (TeamScheduleCard, TeamRosterTab): it's a bonus
// section with inconsistent free-tier coverage (design spec §2, pseudocode
// §5). Per pseudocode:
//   - loading  -> Spinner
//   - error    -> renders nothing (silent, no EmptyState)
//   - success + empty stats array -> renders nothing (silent)
//   - success + data -> renders a "Stats" heading + one row per stat
//
// §5.2 (playerstats field names) is still unconfirmed, so the
// success-with-data case only asserts COUNT/gating, not field content.
// CONVENTION assumed for this test: each rendered stat entry carries
// data-testid="stat-row" — adjust here if the implementation lands on a
// different marker once field names are confirmed.

vi.mock("../../hooks/useSportsDbFetch", () => ({
  useSportsDbFetch: vi.fn(),
}));

vi.mock("../../components/common/Spinner", () => ({
  default: () => <div data-testid="spinner" />,
}));

const idleResult = { data: null, status: "idle", error: null, isLoading: false };

function stubFetch(result) {
  useSportsDbFetch.mockImplementation((buildUrl) => {
    const url = buildUrl();
    if (!url) return idleResult;
    return result;
  });
}

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

  it("renders nothing when the fetch errors (silent, no EmptyState)", () => {
    stubFetch({ ...idleResult, status: "error", error: new Error("boom") });
    const { container } = render(<PlayerStats playerId="34145938" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing on success when the stats payload is null", () => {
    stubFetch({ ...idleResult, status: "success", data: { playerstats: null } });
    const { container } = render(<PlayerStats playerId="34145938" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing on success when the stats array is empty", () => {
    stubFetch({ ...idleResult, status: "success", data: { playerstats: [] } });
    const { container } = render(<PlayerStats playerId="34145938" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing while idle (no request made yet)", () => {
    const { container } = render(<PlayerStats playerId="34145938" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a Stats heading and one row per stat entry on success", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: {
        playerstats: [{ idPlayer: "1" }, { idPlayer: "1" }, { idPlayer: "1" }],
      },
    });
    render(<PlayerStats playerId="34145938" />);

    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getAllByTestId("stat-row")).toHaveLength(3);
  });

  it("does not crash when the fetch has not resolved yet", () => {
    expect(() => render(<PlayerStats playerId="34145938" />)).not.toThrow();
  });
});
