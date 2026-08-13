import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TeamTabs from "../../components/team/TeamTabs";

// TeamTabs is fully presentational — same shape as the accordion's toggle
// button, just three-way instead of open/closed. No fetching, no domain
// knowledge. Assumes buttons expose role="tab" with aria-selected, since
// that's the correct ARIA pairing for the ARIA state pseudocode calls for.

describe("TeamTabs", () => {
  it("renders a tab button for overview, roster, and schedule", () => {
    render(<TeamTabs activeTab="overview" onTabChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /roster/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /schedule/i })).toBeInTheDocument();
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
    expect(screen.getByRole("tab", { name: /schedule/i })).toHaveAttribute(
      "aria-selected",
      "false"
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

  it("calls onTabChange with 'schedule' when the Schedule tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<TeamTabs activeTab="overview" onTabChange={onTabChange} />);

    await user.click(screen.getByRole("tab", { name: /schedule/i }));
    expect(onTabChange).toHaveBeenCalledWith("schedule");
  });

  it("still calls onTabChange when clicking the already-active tab", async () => {
    // No "closing" behavior like the accordion — tabs aren't toggleable,
    // clicking the current tab is a no-op re-selection at most.
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<TeamTabs activeTab="overview" onTabChange={onTabChange} />);

    await user.click(screen.getByRole("tab", { name: /overview/i }));
    expect(onTabChange).toHaveBeenCalledWith("overview");
  });
});
