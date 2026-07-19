import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { API_VERSION } from "../src/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("API_VERSION", () => {
  it("equals package.json major.minor", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      version: string;
    };
    const [major, minor] = pkg.version.split(".");
    expect(API_VERSION).toBe(`${major}.${minor}`);
  });
});
