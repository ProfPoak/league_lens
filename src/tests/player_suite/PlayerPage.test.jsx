import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlayerPage from "../../pages/PlayerPage";
import { useSportsDbFetch } from "../../hooks/useSportsDbFetch";

// PlayerPage owns the single player lookup (lookupplayer.php) 
// render children with the fetched player passed straight down (no re-fetching in children).
// All three children are mocked so these tests only exercise PlayerPage's
// own fetch-status/composition logic, not the children's internals.

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "34145938" }),
  };
});

vi.mock("../../hooks/useSportsDbFetch", () => ({
  useSportsDbFetch: vi.fn(),
}));

vi.mock("../../components/common/Spinner", () => ({
  default: () => <div data-testid="spinner" />,
}));

vi.mock("../../components/common/EmptyState", () => ({
  default: ({ message }) => <div data-testid="empty-state">{message}</div>,
}));

vi.mock("../../components/player/PlayerHeader", () => ({
  default: ({ player }) => <div data-testid="player-header">{player?.strPlayer}</div>,
}));

vi.mock("../../components/player/PlayerBio", () => ({
  default: ({ player }) => <div data-testid="player-bio">{player?.strPlayer}</div>,
}));

vi.mock("../../components/player/PlayerStats", () => ({
  default: ({ playerId }) => <div data-testid="player-stats">{playerId}</div>,
}));

const idleResult = { data: null, status: "idle", error: null, isLoading: false };
const foundPlayerResult = {
  ...idleResult,
  status: "success",
  data: { players: [{ idPlayer: "34145938", strPlayer: "Patrick Mahomes" }] },
};

function stubPlayerFetch(result) {
  useSportsDbFetch.mockReturnValue(result);
}

function renderPlayerPage() {
  return render(
    <MemoryRouter>
      <PlayerPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  stubPlayerFetch(idleResult);
});

describe("PlayerPage", () => {
  it("shows a spinner while the player fetch is idle", () => {
    stubPlayerFetch({ ...idleResult, status: "idle" });
    renderPlayerPage();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows a spinner while the player fetch is loading", () => {
    stubPlayerFetch({ ...idleResult, status: "loading", isLoading: true });
    renderPlayerPage();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows an error empty state when the player fetch fails", () => {
    stubPlayerFetch({ ...idleResult, status: "error", error: new Error("boom") });
    renderPlayerPage();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Couldn't load player.");
  });

  it("shows a 'player not found' empty state when the players array is empty", () => {
    stubPlayerFetch({ ...idleResult, status: "success", data: { players: [] } });
    renderPlayerPage();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Player not found.");
  });

  it("shows a 'player not found' empty state when the players payload is null", () => {
    stubPlayerFetch({ ...idleResult, status: "success", data: { players: null } });
    renderPlayerPage();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Player not found.");
  });

  it("requests the player lookup using the route id", () => {
    stubPlayerFetch(foundPlayerResult);
    renderPlayerPage();
    const [[buildUrl]] = useSportsDbFetch.mock.calls;
    expect(buildUrl()).toContain("lookupplayer");
    expect(buildUrl()).toContain("34145938");
  });

  it("renders PlayerHeader with the fetched player on success", () => {
    stubPlayerFetch(foundPlayerResult);
    renderPlayerPage();
    expect(screen.getByTestId("player-header")).toHaveTextContent("Patrick Mahomes");
  });

  it("renders PlayerBio with the fetched player on success", () => {
    stubPlayerFetch(foundPlayerResult);
    renderPlayerPage();
    expect(screen.getByTestId("player-bio")).toHaveTextContent("Patrick Mahomes");
  });

  it("renders PlayerStats with the route id on success", () => {
    stubPlayerFetch(foundPlayerResult);
    renderPlayerPage();
    expect(screen.getByTestId("player-stats")).toHaveTextContent("34145938");
  });

  it("does not render any child components while loading", () => {
    stubPlayerFetch({ ...idleResult, status: "loading", isLoading: true });
    renderPlayerPage();
    expect(screen.queryByTestId("player-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("player-bio")).not.toBeInTheDocument();
    expect(screen.queryByTestId("player-stats")).not.toBeInTheDocument();
  });

  it("does not render any child components on error", () => {
    stubPlayerFetch({ ...idleResult, status: "error", error: new Error("boom") });
    renderPlayerPage();
    expect(screen.queryByTestId("player-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("player-bio")).not.toBeInTheDocument();
    expect(screen.queryByTestId("player-stats")).not.toBeInTheDocument();
  });
});
