import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TeamScheduleCard from "../../components/team/TeamScheduleCard";
import { useSportsDbFetch } from "../../hooks/useSportsDbFetch";

// TeamScheduleCard renders under the description in TeamOverviewTab
// (no longer a separate tab). It owns two independent fetches — upcoming
// and past — and CONFIRMED: both are capped at a single result on the
// free tier (eventsnext.php and eventslast.php alike), so "Last Game"
// is a single optional event, not a list, same shape as "Next Game".
// No .map() anywhere in this component.
//
// MatchRow is mocked here so these tests only exercise TeamScheduleCard's
// own fetch-gating/status logic, not MatchRow's rendering.

vi.mock("../../hooks/useSportsDbFetch", () => ({
  useSportsDbFetch: vi.fn(),
}));

vi.mock("../../components/common/Spinner", () => ({
  default: () => <div data-testid="spinner" />,
}));

vi.mock("../../components/common/EmptyState", () => ({
  default: ({ message }) => <div data-testid="empty-state">{message}</div>,
}));

vi.mock("../../components/team/MatchRow", () => ({
  default: ({ event, mode }) => (
    <div data-testid={`match-row-${mode}`}>{event.strEvent ?? event.idEvent}</div>
  ),
}));

const idleResult = { data: null, status: "idle", error: null, isLoading: false };

function stubFetch({ upcoming = idleResult, past = idleResult } = {}) {
  useSportsDbFetch.mockImplementation((buildUrl) => {
    const url = buildUrl();
    if (!url) return idleResult;
    if (url.includes("eventsnext.php")) return upcoming;
    if (url.includes("eventslast.php")) return past;
    return idleResult;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  stubFetch();
});

describe("TeamScheduleCard", () => {
  it("requests upcoming events and past events using the team's id", () => {
    render(<TeamScheduleCard teamId="134946" />);

    const urls = useSportsDbFetch.mock.calls.map(([buildUrl]) => buildUrl());
    expect(urls.some((u) => u?.includes("eventsnext.php") && u?.includes("134946"))).toBe(true);
    expect(urls.some((u) => u?.includes("eventslast.php") && u?.includes("134946"))).toBe(true);
  });

  it("renders both section headings", () => {
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("Next Game")).toBeInTheDocument();
    expect(screen.getByText("Last Game")).toBeInTheDocument();
  });

  it("shows a spinner under Next Game while the upcoming fetch is loading, independent of past status", () => {
    stubFetch({
      upcoming: { ...idleResult, status: "loading", isLoading: true },
      past: { ...idleResult, status: "success", data: { results: [] } },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByText("No recent results.")).toBeInTheDocument();
  });

  it("shows a spinner under Last Game while the past fetch is loading, independent of upcoming status", () => {
    stubFetch({
      upcoming: { ...idleResult, status: "success", data: { events: [] } },
      past: { ...idleResult, status: "loading", isLoading: true },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByText("No upcoming game scheduled.")).toBeInTheDocument();
  });

  it("shows an error empty state when the upcoming fetch fails", () => {
    stubFetch({ upcoming: { ...idleResult, status: "error", error: new Error("boom") } });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("Couldn't load next game.")).toBeInTheDocument();
  });

  it("shows an error empty state when the past fetch fails", () => {
    stubFetch({ past: { ...idleResult, status: "error", error: new Error("boom") } });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("Couldn't load last game.")).toBeInTheDocument();
  });

  it("shows 'no upcoming game scheduled' when the upcoming events array is empty", () => {
    stubFetch({ upcoming: { ...idleResult, status: "success", data: { events: [] } } });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("No upcoming game scheduled.")).toBeInTheDocument();
  });

  it("treats a null upcoming payload as no game, not a crash", () => {
    stubFetch({ upcoming: { ...idleResult, status: "success", data: null } });
    expect(() => render(<TeamScheduleCard teamId="134946" />)).not.toThrow();
    expect(screen.getByText("No upcoming game scheduled.")).toBeInTheDocument();
  });

  it("renders a single MatchRow in upcoming mode when a next event exists", () => {
    stubFetch({
      upcoming: {
        ...idleResult,
        status: "success",
        data: { events: [{ idEvent: "1", strEvent: "Chiefs vs Bills" }] },
      },
    });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByTestId("match-row-upcoming")).toHaveTextContent("Chiefs vs Bills");
  });

  it("shows 'no recent results' when the past results array is empty", () => {
    stubFetch({ past: { ...idleResult, status: "success", data: { results: [] } } });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("No recent results.")).toBeInTheDocument();
  });

  it("treats a null past payload as no result, not a crash", () => {
    stubFetch({ past: { ...idleResult, status: "success", data: null } });
    expect(() => render(<TeamScheduleCard teamId="134946" />)).not.toThrow();
    expect(screen.getByText("No recent results.")).toBeInTheDocument();
  });

  it("renders a single MatchRow in past mode when a last game exists", () => {
    stubFetch({
      past: {
        ...idleResult,
        status: "success",
        data: { results: [{ idEvent: "9", strEvent: "Chiefs vs Broncos" }] },
      },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getAllByTestId("match-row-past")).toHaveLength(1);
    expect(screen.getByText("Chiefs vs Broncos")).toBeInTheDocument();
  });

  it("ignores extra entries and only renders the first past result if more than one is somehow returned", () => {
    stubFetch({
      past: {
        ...idleResult,
        status: "success",
        data: {
          results: [
            { idEvent: "9", strEvent: "Chiefs vs Broncos" },
            { idEvent: "10", strEvent: "Chiefs vs Chargers" },
          ],
        },
      },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getAllByTestId("match-row-past")).toHaveLength(1);
    expect(screen.getByText("Chiefs vs Broncos")).toBeInTheDocument();
  });

  it("renders without crashing when both fetches are still idle", () => {
    expect(() => render(<TeamScheduleCard teamId="134946" />)).not.toThrow();
  });
});