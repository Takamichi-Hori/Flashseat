import { describe, expect, it } from "vitest";
import { assertCanReserve } from "../src/domain/inventory.js";

describe("assertCanReserve", () => {
  it("accepts available quantity", () => {
    expect(() =>
      assertCanReserve(100, 40, 2)
    ).not.toThrow();
  });

  it("accepts the last available ticket", () => {
    expect(() =>
      assertCanReserve(100, 99, 1)
    ).not.toThrow();
  });

  it("rejects overselling", () => {
    expect(() =>
      assertCanReserve(100, 99, 2)
    ).toThrow("not_enough_tickets");
  });

  it("rejects quantity below 1", () => {
    expect(() =>
      assertCanReserve(100, 0, 0)
    ).toThrow("invalid_quantity");
  });

  it("rejects quantity above 10", () => {
    expect(() =>
      assertCanReserve(100, 0, 11)
    ).toThrow("invalid_quantity");
  });
});