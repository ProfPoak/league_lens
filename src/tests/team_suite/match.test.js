import { describe, it, expect } from "vitest";
import { getMatchResult } from "../../utils/match";

// Pure function — no React, no mocks needed. Covers all four branches:
// win, loss, draw, and the null-score guard (game not yet played /
// score fields missing on the free tier).

describe("getMatchResult", () => {
  it("returns 'W' when the team is home and scored more than the opponent", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: 3, intAwayScore: 1 };
    expect(getMatchResult(event, "1")).toBe("W");
  });

  it("returns 'L' when the team is home and scored less than the opponent", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: 0, intAwayScore: 2 };
    expect(getMatchResult(event, "1")).toBe("L");
  });

  it("returns 'D' when the team is home and scores are equal", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: 1, intAwayScore: 1 };
    expect(getMatchResult(event, "1")).toBe("D");
  });

  it("returns 'W' when the team is away and scored more than the opponent", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: 0, intAwayScore: 4 };
    expect(getMatchResult(event, "2")).toBe("W");
  });

  it("returns 'L' when the team is away and scored less than the opponent", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: 3, intAwayScore: 1 };
    expect(getMatchResult(event, "2")).toBe("L");
  });

  it("returns 'D' when the team is away and scores are equal", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: 2, intAwayScore: 2 };
    expect(getMatchResult(event, "2")).toBe("D");
  });

  it("returns null when intHomeScore is null", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: null, intAwayScore: 1 };
    expect(getMatchResult(event, "1")).toBeNull();
  });

  it("returns null when intAwayScore is null", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: 1, intAwayScore: null };
    expect(getMatchResult(event, "1")).toBeNull();
  });

  it("returns null when both scores are missing", () => {
    const event = { idHomeTeam: "1", idAwayTeam: "2" };
    expect(getMatchResult(event, "1")).toBeNull();
  });

  it("treats numeric-string scores correctly (free tier sometimes returns strings)", () => {
    // '10' > '9' is false lexically but true numerically — this guards
    // against a regression if someone "fixes" the >/< to be stricter.
    const event = { idHomeTeam: "1", idAwayTeam: "2", intHomeScore: "10", intAwayScore: "9" };
    expect(getMatchResult(event, "1")).toBe("W");
  });
});