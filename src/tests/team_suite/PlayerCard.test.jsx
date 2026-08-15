import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import PlayerCard from "../../components/team/PlayerCard";

// PlayerCard is presentational, same empty-field-hides rule used across
// the app (Team Overview, Player Bio): missing optional fields are simply
// not rendered, never shown as "N/A".

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const fullPlayer = {
  idPlayer: "34145938",
  strPlayer: "Patrick Mahomes",
  strCutout: "https://example.com/mahomes-cutout.png",
  strPosition: "Quarterback",
  strNationality: "USA",
};

describe("PlayerCard", () => {
  it("renders the player's name", () => {
    renderWithRouter(<PlayerCard player={fullPlayer} />);
    expect(screen.getByText("Patrick Mahomes")).toBeInTheDocument();
  });

  it("links to the player's detail page by id", () => {
    renderWithRouter(<PlayerCard player={fullPlayer} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/player/34145938"
    );
  });

  it("renders the cutout image when present", () => {
    renderWithRouter(<PlayerCard player={fullPlayer} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      fullPlayer.strCutout
    );
  });

  it("does not render an image when strCutout is missing", () => {
    const { strCutout, ...playerWithoutCutout } = fullPlayer;
    renderWithRouter(<PlayerCard player={playerWithoutCutout} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the position when present", () => {
    renderWithRouter(<PlayerCard player={fullPlayer} />);
    expect(screen.getByText("Quarterback")).toBeInTheDocument();
  });

  it("does not render position text when strPosition is missing", () => {
    const { strPosition, ...playerWithoutPosition } = fullPlayer;
    renderWithRouter(<PlayerCard player={playerWithoutPosition} />);
    expect(screen.queryByText("Quarterback")).not.toBeInTheDocument();
  });

  it("renders the nationality when present", () => {
    renderWithRouter(<PlayerCard player={fullPlayer} />);
    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("does not render nationality text when strNationality is missing", () => {
    const { strNationality, ...playerWithoutNationality } = fullPlayer;
    renderWithRouter(<PlayerCard player={playerWithoutNationality} />);
    expect(screen.queryByText("USA")).not.toBeInTheDocument();
  });

  it("renders without crashing when only required fields are present", () => {
    const minimalPlayer = { idPlayer: "1", strPlayer: "Jane Doe" };
    expect(() =>
      renderWithRouter(<PlayerCard player={minimalPlayer} />)
    ).not.toThrow();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });
});
