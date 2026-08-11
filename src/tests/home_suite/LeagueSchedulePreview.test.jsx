import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LeagueSchedulePreview from "../../components/home/LeagueSchedulePreview";

vi.mock("../../components/common/EmptyState", () => ({
  default: ({ message }) => <div data-testid="empty-state">{message}</div>,
}));

vi.mock("../../utils/formatters", () => ({
  formatEventDateTime: (event) => `formatted-${event.idEvent}`,
}));

describe("LeagueSchedulePreview", () => {
  it("renders the section heading", () => {
    render(<LeagueSchedulePreview data={null} status="idle" />);
    expect(screen.getByText("Next League Event:")).toBeInTheDocument();
  });

  it("shows an error empty state when status is 'error'", () => {
    render(<LeagueSchedulePreview data={null} status="error" />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent("Could not load event");
  });

  it("shows a 'no upcoming events' empty state on success with no events", () => {
    render(<LeagueSchedulePreview data={{ events: [] }} status="success" />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No upcoming events");
  });

  it("treats a missing events array as empty rather than crashing", () => {
    expect(() =>
      render(<LeagueSchedulePreview data={{}} status="success" />)
    ).not.toThrow();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No upcoming events");
  });

  it("does not show an empty state while still loading", () => {
    render(<LeagueSchedulePreview data={null} status="loading" />);
    expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
  });

  it("renders one card per event with its name and formatted date", () => {
    const events = [
      { idEvent: "1", strEvent: "Chiefs vs Bills" },
      { idEvent: "2", strEvent: "Eagles vs Cowboys" },
    ];
    render(<LeagueSchedulePreview data={{ events }} status="success" />);

    expect(screen.getByText("Chiefs vs Bills")).toBeInTheDocument();
    expect(screen.getByText("formatted-1")).toBeInTheDocument();
    expect(screen.getByText("Eagles vs Cowboys")).toBeInTheDocument();
    expect(screen.getByText("formatted-2")).toBeInTheDocument();
  });
});