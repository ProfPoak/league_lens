import { describe, it, expect } from "vitest";
import { groupBy } from "../../utils/roster";

describe("groupBy", () => {
  it("groups items by the key returned from keyFn", () => {
    const players = [
      { name: "A", pos: "QB" },
      { name: "B", pos: "WR" },
      { name: "C", pos: "QB" },
    ];

    const result = groupBy(players, (p) => p.pos);

    expect(result.QB).toHaveLength(2);
    expect(result.WR).toHaveLength(1);
    expect(result.QB.map((p) => p.name)).toEqual(["A", "C"]);
  });

  it("returns an empty object when given an empty array", () => {
    expect(groupBy([], (p) => p.pos)).toEqual({});
  });

  it("preserves item order within each group", () => {
    const items = [{ k: "x", v: 1 }, { k: "x", v: 2 }, { k: "x", v: 3 }];
    const result = groupBy(items, (i) => i.k);
    expect(result.x.map((i) => i.v)).toEqual([1, 2, 3]);
  });

  it("creates a single bucket when keyFn returns a fallback for every item", () => {
    const players = [{ name: "A" }, { name: "B" }];
    const result = groupBy(players, (p) => p.strPosition || "Other");
    expect(result.Other).toHaveLength(2);
  });
});