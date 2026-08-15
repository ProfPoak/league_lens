import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TeamScheduleCard from "../../components/team/TeamScheduleCard";
import { useSportsDbFetch } from "../../hooks/useSportsDbFetch";

// TeamScheduleCard is what used to be TeamScheduleTab's fetching logic,
// now rendered inline under the description in TeamOverviewTab rather
// than behind a third tab. It owns two independent fetches (upcoming,
// past) and renders each section's loading/error/empty states on its
// own timeline — one section being ready doesn't block the other.
//
// ASSUMPTIONS (flagged for confirmation against the real API):
// - buildUpcomingEventsUrl response shape: { events: [...] }, capped at 1
//   entry on the free tier per prior findings.
// - buildPastEventsUrl response shape: { results: [...] } — NOT yet
//   confirmed against a real response. Update the `past` field access in
//   TeamScheduleCard (and these tests) if the actual key differs.
// - MatchRow is mocked here so these tests only exercise TeamScheduleCard's
//   own fetch-gating/status logic, not MatchRow's rendering.

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

// Routes each useSportsDbFetch() call to an upcoming- or past-shaped
// result based on the URL its buildUrl() produces, mirroring the
// LeagueAccordionItem test's dual-hook-call pattern.
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
    expect(screen.getByText("Recent Form")).toBeInTheDocument();
  });

  it("shows a spinner under Next Game while the upcoming fetch is loading, independent of past status", () => {
    stubFetch({
      upcoming: { ...idleResult, status: "loading", isLoading: true },
      past: { ...idleResult, status: "success", data: { results: [] } },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No recent results.");
  });

  it("shows a spinner under Recent Form while the past fetch is loading, independent of upcoming status", () => {
    stubFetch({
      upcoming: { ...idleResult, status: "success", data: { events: [] } },
      past: { ...idleResult, status: "loading", isLoading: true },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No upcoming game scheduled.");
  });

  it("shows an error empty state when the upcoming fetch fails", () => {
    stubFetch({ upcoming: { ...idleResult, status: "error", error: new Error("boom") } });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("Couldn't load next game.")).toBeInTheDocument();
  });

  it("shows an error empty state when the past fetch fails", () => {
    stubFetch({ past: { ...idleResult, status: "error", error: new Error("boom") } });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("Couldn't load recent results.")).toBeInTheDocument();
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

  it("only renders the first upcoming event even if more are somehow returned", () => {
    stubFetch({
      upcoming: {
        ...idleResult,
        status: "success",
        data: {
          events: [
            { idEvent: "1", strEvent: "Chiefs vs Bills" },
            { idEvent: "2", strEvent: "Chiefs vs Raiders" },
          ],
        },
      },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getAllByTestId("match-row-upcoming")).toHaveLength(1);
    expect(screen.getByText("Chiefs vs Bills")).toBeInTheDocument();
  });

  it("shows 'no recent results' when the past results array is empty", () => {
    stubFetch({ past: { ...idleResult, status: "success", data: { results: [] } } });
    render(<TeamScheduleCard teamId="134946" />);
    expect(screen.getByText("No recent results.")).toBeInTheDocument();
  });

  it("treats a null past payload as no results, not a crash", () => {
    stubFetch({ past: { ...idleResult, status: "success", data: null } });
    expect(() => render(<TeamScheduleCard teamId="134946" />)).not.toThrow();
    expect(screen.getByText("No recent results.")).toBeInTheDocument();
  });

  it("renders one MatchRow in past mode per past result", () => {
    stubFetch({
      past: {
        ...idleResult,
        status: "success",
        data: {
          results: [
            { idEvent: "1", strEvent: "Chiefs vs Broncos" },
            { idEvent: "2", strEvent: "Chiefs vs Chargers" },
          ],
        },
      },
    });
    render(<TeamScheduleCard teamId="134946" />);

    expect(screen.getAllByTestId("match-row-past")).toHaveLength(2);
    expect(screen.getByText("Chiefs vs Broncos")).toBeInTheDocument();
    expect(screen.getByText("Chiefs vs Chargers")).toBeInTheDocument();
  });

  it("renders without crashing when both fetches are still idle", () => {
    expect(() => render(<TeamScheduleCard teamId="134946" />)).not.toThrow();
  });
});
