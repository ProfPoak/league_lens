import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TeamPage from "../../pages/TeamPage";
import { useSportsDbFetch } from "../../hooks/useSportsDbFetch";

// TeamPage only switches between two tabs: "overview" and "roster".

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "134946" }),
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

vi.mock("../../components/team/TeamTabs", () => ({
  default: ({ activeTab, onTabChange }) => (
    <div data-testid="team-tabs" data-active={activeTab}>
      <button onClick={() => onTabChange("overview")}>overview</button>
      <button onClick={() => onTabChange("roster")}>roster</button>
    </div>
  ),
}));

vi.mock("../../components/team/TeamOverviewTab", () => ({
  default: ({ team, teamId }) => (
    <div data-testid="overview-tab" data-team-id={teamId}>
      {team?.strTeam}
    </div>
  ),
}));

vi.mock("../../components/team/TeamRosterTab", () => ({
  default: ({ teamId }) => <div data-testid="roster-tab">{teamId}</div>,
}));

const idleResult = { data: null, status: "idle", error: null, isLoading: false };
const foundTeamResult = {
  ...idleResult,
  status: "success",
  data: { teams: [{ idTeam: "134946", strTeam: "Kansas City Chiefs" }] },
};

function stubTeamFetch(result) {
  useSportsDbFetch.mockReturnValue(result);
}

function renderTeamPage() {
  return render(
    <MemoryRouter>
      <TeamPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  stubTeamFetch(idleResult);
});

describe("TeamPage", () => {
  it("shows a spinner while the team fetch is idle", () => {
    stubTeamFetch({ ...idleResult, status: "idle" });
    renderTeamPage();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows a spinner while the team fetch is loading", () => {
    stubTeamFetch({ ...idleResult, status: "loading", isLoading: true });
    renderTeamPage();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows an error empty state when the team fetch fails", () => {
    stubTeamFetch({ ...idleResult, status: "error", error: new Error("boom") });
    renderTeamPage();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Couldn't load team.");
  });

  it("shows a 'team not found' empty state when the teams array is empty", () => {
    stubTeamFetch({ ...idleResult, status: "success", data: { teams: [] } });
    renderTeamPage();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Team not found.");
  });

  it("shows a 'team not found' empty state when the teams payload is null", () => {
    stubTeamFetch({ ...idleResult, status: "success", data: { teams: null } });
    renderTeamPage();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Team not found.");
  });

  it("renders TeamTabs defaulting to the overview tab", () => {
    stubTeamFetch(foundTeamResult);
    renderTeamPage();
    expect(screen.getByTestId("team-tabs")).toHaveAttribute("data-active", "overview");
  });

  it("renders TeamOverviewTab with the fetched team and teamId by default", () => {
    stubTeamFetch(foundTeamResult);
    renderTeamPage();
    const overview = screen.getByTestId("overview-tab");
    expect(overview).toHaveTextContent("Kansas City Chiefs");
    expect(overview).toHaveAttribute("data-team-id", "134946");
    expect(screen.queryByTestId("roster-tab")).not.toBeInTheDocument();
  });

  it("switches to TeamRosterTab and passes teamId when TeamTabs reports a change", async () => {
    const user = userEvent.setup();
    stubTeamFetch(foundTeamResult);
    renderTeamPage();

    await user.click(screen.getByText("roster"));

    expect(screen.getByTestId("roster-tab")).toHaveTextContent("134946");
    expect(screen.queryByTestId("overview-tab")).not.toBeInTheDocument();
  });

  it("only mounts one tab's component at a time", async () => {
    const user = userEvent.setup();
    stubTeamFetch(foundTeamResult);
    renderTeamPage();

    await user.click(screen.getByText("roster"));

    expect(screen.getByTestId("roster-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("overview-tab")).not.toBeInTheDocument();
  });

  it("does not offer a schedule tab option at all", () => {
    stubTeamFetch(foundTeamResult);
    renderTeamPage();
    expect(screen.queryByText("schedule")).not.toBeInTheDocument();
  });
});
