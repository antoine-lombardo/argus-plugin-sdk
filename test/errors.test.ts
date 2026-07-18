import { describe, expect, it } from "vitest";

import {
  ArgusError,
  isArgusError,
  isExpectedArgusError,
} from "../src/errors.js";

describe("isArgusError", () => {
  it("recognizes a real ArgusError instance", () => {
    expect(isArgusError(new ArgusError("PLUGIN_ERROR", "boom"))).toBe(true);
  });

  it("duck-types a foreign-bundled shape (no instanceof)", () => {
    const foreign = Object.assign(new Error("auth"), {
      name: "ArgusError",
      code: "AUTH_REQUIRED",
    });
    expect(foreign instanceof ArgusError).toBe(false);
    expect(isArgusError(foreign)).toBe(true);
  });

  it("rejects unknown codes and plain errors", () => {
    expect(isArgusError(new Error("nope"))).toBe(false);
    expect(
      isArgusError({ name: "ArgusError", code: "NOT_A_REAL_CODE" }),
    ).toBe(false);
  });
});

describe("isExpectedArgusError", () => {
  it("treats AUTH_REQUIRED as expected and PLUGIN_ERROR as not", () => {
    expect(isExpectedArgusError(new ArgusError("AUTH_REQUIRED"))).toBe(true);
    expect(isExpectedArgusError(new ArgusError("PLUGIN_ERROR"))).toBe(false);
  });
});
