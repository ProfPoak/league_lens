import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import PlayerBio from "../../components/player/PlayerBio";

// PlayerBio is presentational. Every bio field is its own independent
// guard (per pseudocode §4) — height/weight render together as one line
// gated on "either present", everything else is its own field. The
// description toggle defaults OPEN, matching TeamOverviewTab (§5.3).

vi.mock("../../components/common/Collapsible", () => ({
  default: ({ isOpen, children }) => (
    <div data-testid="collapsible" data-open={isOpen}>
      {children}
    </div>
  ),
}));

const fullPlayer = {
  idPlayer: "34145938",
  strPlayer: "Patrick Mahomes",
  dateBorn: "1995-09-17",
  strBirthLocation: "Tyler, Texas, USA",
  strNationality: "USA",
  strHeight: "6 ft 2 in (1.88 m)",
  strWeight: "225 lb (102 kg)",
  strDescriptionEN: "Patrick Mahomes is an American football quarterback...",
};

describe("PlayerBio", () => {
  it("renders the birth date when dateBorn is present", () => {
    render(<PlayerBio player={fullPlayer} />);
    expect(screen.getByText(/1995-09-17/)).toBeInTheDocument();
  });

  it("does not render a birth date when dateBorn is missing", () => {
    const { dateBorn, ...playerWithoutDob } = fullPlayer;
    render(<PlayerBio player={playerWithoutDob} />);
    expect(screen.queryByText(/Born/)).not.toBeInTheDocument();
  });

  it("renders the birth location when present", () => {
    render(<PlayerBio player={fullPlayer} />);
    expect(screen.getByText("Tyler, Texas, USA")).toBeInTheDocument();
  });

  it("does not render birth location when strBirthLocation is missing", () => {
    const { strBirthLocation, ...playerWithoutLocation } = fullPlayer;
    render(<PlayerBio player={playerWithoutLocation} />);
    expect(screen.queryByText("Tyler, Texas, USA")).not.toBeInTheDocument();
  });

  it("renders nationality when present", () => {
    render(<PlayerBio player={fullPlayer} />);
    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("does not render nationality when strNationality is missing", () => {
    const { strNationality, ...playerWithoutNationality } = fullPlayer;
    render(<PlayerBio player={playerWithoutNationality} />);
    expect(screen.queryByText("USA")).not.toBeInTheDocument();
  });

  it("renders height and weight together when both are present", () => {
    render(<PlayerBio player={fullPlayer} />);
    expect(screen.getByText(/6 ft 2 in \(1\.88 m\)/)).toBeInTheDocument();
    expect(screen.getByText(/225 lb \(102 kg\)/)).toBeInTheDocument();
  });

  it("still renders the height/weight line when only strHeight is present", () => {
    const { strWeight, ...playerHeightOnly } = fullPlayer;
    render(<PlayerBio player={playerHeightOnly} />);
    expect(screen.getByText(/6 ft 2 in \(1\.88 m\)/)).toBeInTheDocument();
  });

  it("still renders the height/weight line when only strWeight is present", () => {
    const { strHeight, ...playerWeightOnly } = fullPlayer;
    render(<PlayerBio player={playerWeightOnly} />);
    expect(screen.getByText(/225 lb \(102 kg\)/)).toBeInTheDocument();
  });

  it("does not render the height/weight line when both are missing", () => {
    const { strHeight, strWeight, ...playerWithoutSize } = fullPlayer;
    render(<PlayerBio player={playerWithoutSize} />);
    expect(screen.queryByText(/ft|lb|kg|m\)/)).not.toBeInTheDocument();
  });

  it("does not render a description toggle when strDescriptionEN is missing", () => {
    const { strDescriptionEN, ...playerWithoutDescription } = fullPlayer;
    render(<PlayerBio player={playerWithoutDescription} />);
    expect(
      screen.queryByRole("button", { name: /description/i })
    ).not.toBeInTheDocument();
  });

  it("renders an OPEN description toggle by default when strDescriptionEN is present", () => {
    render(<PlayerBio player={fullPlayer} />);
    expect(
      screen.getByRole("button", { name: /hide description/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("collapsible")).toHaveAttribute("data-open", "true");
  });

  it("closes the description and relabels the toggle when clicked", async () => {
    const user = userEvent.setup();
    render(<PlayerBio player={fullPlayer} />);

    await user.click(screen.getByRole("button", { name: /hide description/i }));

    expect(screen.getByTestId("collapsible")).toHaveAttribute("data-open", "false");
    expect(screen.getByRole("button", { name: /show description/i })).toBeInTheDocument();
  });

  it("reopens the description on a second click", async () => {
    const user = userEvent.setup();
    render(<PlayerBio player={fullPlayer} />);

    const toggle = () => screen.getByRole("button", { name: /description/i });
    await user.click(toggle());
    await user.click(toggle());

    expect(screen.getByTestId("collapsible")).toHaveAttribute("data-open", "true");
  });

  it("renders without crashing when every optional field is missing", () => {
    const minimalPlayer = { idPlayer: "1", strPlayer: "Jane Doe" };
    expect(() => render(<PlayerBio player={minimalPlayer} />)).not.toThrow();
  });
});
