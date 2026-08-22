import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TeamRosterTab from "../../components/team/TeamRosterTab";
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

vi.mock("../../components/team/PlayerCard", () => ({
  default: ({ player }) => (
    <div data-testid="player-card">{player.strPlayer}</div>
  ),
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

describe("TeamRosterTab", () => {
  it("requests the roster using the team's id", () => {
    render(<TeamRosterTab teamId="134946" />);
    const [[buildUrl]] = useSportsDbFetch.mock.calls;
    expect(buildUrl()).toContain("lookup_all_players");
    expect(buildUrl()).toContain("134946");
  });

  it("shows a spinner while loading", () => {
    stubFetch({ ...idleResult, status: "loading", isLoading: true });
    render(<TeamRosterTab teamId="134946" />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows an error empty state when the fetch fails", () => {
    stubFetch({ ...idleResult, status: "error", error: new Error("boom") });
    render(<TeamRosterTab teamId="134946" />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "Couldn't load roster."
    );
  });

  it("shows an empty state when the roster payload is null", () => {
    stubFetch({ ...idleResult, status: "success", data: { player: null } });
    expect(() => render(<TeamRosterTab teamId="134946" />)).not.toThrow();
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No roster data available."
    );
  });

  it("shows an empty state when the roster list is empty", () => {
    stubFetch({ ...idleResult, status: "success", data: { player: [] } });
    render(<TeamRosterTab teamId="134946" />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No roster data available."
    );
  });

  it("renders one PlayerCard per player on success", () => {
    stubFetch({
      ...idleResult,
      status: "success",
      data: {
        player: [
          { idPlayer: "1", strPlayer: "Patrick Mahomes", strPosition: "QB" },
          { idPlayer: "2", strPlayer: "Travis Kelce", strPosition: "TE" },
        ],
      },
    });
    render(<TeamRosterTab teamId="134946" />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByText("Patrick Mahomes")).toBeInTheDocument();
    expect(screen.getByText("Travis Kelce")).toBeInTheDocument();
  });
});
