import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FilterInput from "../../components/common/FilterInput";

// FilterInput is fully controlled, so typing into it without a component
// that actually updates `value` on each onChange would get reset by React
// after every keystroke. This tiny wrapper mimics what LeagueAccordionItem
// does in real usage.
function ControlledFilterInput({ onChange }) {
  const [value, setValue] = useState("");
  return (
    <FilterInput
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
    />
  );
}

describe("FilterInput", () => {
  it("renders the current value", () => {
    render(<FilterInput value="chi" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("chi");
  });

  it("calls onChange with each new value as the user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ControlledFilterInput onChange={handleChange} />);
    await user.type(screen.getByRole("textbox"), "hi");

    expect(handleChange).toHaveBeenNthCalledWith(1, "h");
    expect(handleChange).toHaveBeenNthCalledWith(2, "hi");
  });

  it("uses the default placeholder when none is given", () => {
    render(<FilterInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Filter teams...")).toBeInTheDocument();
  });

  it("uses a custom placeholder when provided", () => {
    render(<FilterInput value="" onChange={() => {}} placeholder="Search players..." />);
    expect(screen.getByPlaceholderText("Search players...")).toBeInTheDocument();
  });

  it("sets aria-label to match the placeholder for accessibility", () => {
    render(<FilterInput value="" onChange={() => {}} placeholder="Search players..." />);
    expect(screen.getByLabelText("Search players...")).toBeInTheDocument();
  });
});