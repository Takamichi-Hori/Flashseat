import { describe, expect, it } from "vitest";
import { assertCanReserve } from "../src/domain/inventory.js";

describe("assertCanReserve", () => {
    it("accepts available quantity", () => {
        expect(() => assertCanReserve(100, 40, 2)).not.toThrow();
    });
});

it("rejects overselling", () => {
    expect( () => assertCanReserve(100, 99, 2)).toThrow();
});