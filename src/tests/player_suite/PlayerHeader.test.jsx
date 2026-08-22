import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import PlayerHeader from "../../components/player/PlayerHeader";

// PlayerHeader is purely presentational — same "each optional field is its
// own independent guard, nothing ever renders as N/A" 
// image prefers strCutout, falls back to strThumb, hidden if both are missing; 
// team link requires BOTH strTeam and idTeam.

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const fullPlayer = {
  idPlayer: "34145938",
  strPlayer: "Patrick Mahomes",
  strCutout: "https://example.com/mahomes-cutout.png",
  strThumb: "https://example.com/mahomes-thumb.png",
  idTeam: "134946",
  strTeam: "Kansas City Chiefs",
  strPosition: "Quarterback",
  strNumber: "15",
};

describe("PlayerHeader", () => {
  it("renders the player's name as a heading", () => {
    renderWithRouter(<PlayerHeader player={fullPlayer} />);
    expect(
      screen.getByRole("heading", { name: "Patrick Mahomes" })
    ).toBeInTheDocument();
  });

  it("prefers strCutout for the photo when both strCutout and strThumb are present", () => {
    renderWithRouter(<PlayerHeader player={fullPlayer} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", fullPlayer.strCutout);
  });

  it("falls back to strThumb when strCutout is missing", () => {
    const { strCutout, ...playerWithThumbOnly } = fullPlayer;
    renderWithRouter(<PlayerHeader player={playerWithThumbOnly} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", fullPlayer.strThumb);
  });

  it("does not render an image when both strCutout and strThumb are missing", () => {
    const { strCutout, strThumb, ...playerWithoutPhoto } = fullPlayer;
    renderWithRouter(<PlayerHeader player={playerWithoutPhoto} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders a team link when both idTeam and strTeam are present", () => {
    renderWithRouter(<PlayerHeader player={fullPlayer} />);
    expect(screen.getByRole("link", { name: "Kansas City Chiefs" })).toHaveAttribute(
      "href",
      "/team/134946"
    );
  });

  it("does not render a team link when idTeam is missing", () => {
    const { idTeam, ...playerWithoutTeamId } = fullPlayer;
    renderWithRouter(<PlayerHeader player={playerWithoutTeamId} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not render a team link when strTeam is missing", () => {
    const { strTeam, ...playerWithoutTeamName } = fullPlayer;
    renderWithRouter(<PlayerHeader player={playerWithoutTeamName} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the position when present", () => {
    renderWithRouter(<PlayerHeader player={fullPlayer} />);
    expect(screen.getByText("Quarterback")).toBeInTheDocument();
  });

  it("does not render position text when strPosition is missing", () => {
    const { strPosition, ...playerWithoutPosition } = fullPlayer;
    renderWithRouter(<PlayerHeader player={playerWithoutPosition} />);
    expect(screen.queryByText("Quarterback")).not.toBeInTheDocument();
  });

  it("renders the jersey number prefixed with '#' when present", () => {
    renderWithRouter(<PlayerHeader player={fullPlayer} />);
    expect(screen.getByText("#15")).toBeInTheDocument();
  });

  it("does not render a number when strNumber is missing", () => {
    const { strNumber, ...playerWithoutNumber } = fullPlayer;
    renderWithRouter(<PlayerHeader player={playerWithoutNumber} />);
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });

  it("renders without crashing when only required fields are present", () => {
    const minimalPlayer = { idPlayer: "1", strPlayer: "Jane Doe" };
    expect(() =>
      renderWithRouter(<PlayerHeader player={minimalPlayer} />)
    ).not.toThrow();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });
});
