import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import TeamListItem from "../../components/home/TeamListItem";

const team = {
  idTeam: "134946",
  strTeam: "Kansas City Chiefs",
  strBadge: "https://example.com/chiefs.png",
};

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("TeamListItem", () => {
  it("renders the team name", () => {
    renderWithRouter(<TeamListItem team={team} />);
    expect(screen.getByText("Kansas City Chiefs")).toBeInTheDocument();
  });

  it("links to the team's detail page by id", () => {
    renderWithRouter(<TeamListItem team={team} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/team/134946");
  });

  it("renders the team badge with descriptive alt text", () => {
    renderWithRouter(<TeamListItem team={team} />);
    const img = screen.getByRole("img", { name: "Kansas City Chiefs logo" });
    expect(img).toHaveAttribute("src", team.strBadge);
  });
});