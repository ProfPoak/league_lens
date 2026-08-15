import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TeamTabs from "../../components/team/TeamTabs";

// TeamTabs drops from three tabs to two: schedule content now lives
// inline in TeamOverviewTab (via TeamScheduleCard) rather than behind
// its own tab, since the free-tier API only ever gives one upcoming
// game and a short past-results list — not enough for a standalone
// browsing view. TeamTabs itself is still fully presentational, no
// fetching, no domain knowledge.

describe("TeamTabs", () => {
  it("renders a tab button for overview and roster only", () => {
    render(<TeamTabs activeTab="overview" onTabChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /roster/i })).toBeInTheDocument();
  });

  it("does not render a schedule tab", () => {
    render(<TeamTabs activeTab="overview" onTabChange={() => {}} />);
    expect(screen.queryByRole("tab", { name: /schedule/i })).not.toBeInTheDocument();
  });

  it("marks only the active tab as aria-selected", () => {
    render(<TeamTabs activeTab="roster" onTabChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /overview/i })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByRole("tab", { name: /roster/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("calls onTabChange with 'overview' when the Overview tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<TeamTabs activeTab="roster" onTabChange={onTabChange} />);

    await user.click(screen.getByRole("tab", { name: /overview/i }));
    expect(onTabChange).toHaveBeenCalledWith("overview");
  });

  it("calls onTabChange with 'roster' when the Roster tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<TeamTabs activeTab="overview" onTabChange={onTabChange} />);

    await user.click(screen.getByRole("tab", { name: /roster/i }));
    expect(onTabChange).toHaveBeenCalledWith("roster");
  });

  it("still calls onTabChange when clicking the already-active tab", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<TeamTabs activeTab="overview" onTabChange={onTabChange} />);

    await user.click(screen.getByRole("tab", { name: /overview/i }));
    expect(onTabChange).toHaveBeenCalledWith("overview");
  });
});