import { describe, expect, it } from "vitest";
import { Ajv2020 } from "ajv/dist/2020.js";
import { manifestJsonSchema } from "../src/index.js";
import type { PluginManifest } from "../src/index.js";
import { sampleManifest } from "./fixtures/sample-plugin.js";

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validate = ajv.compile(manifestJsonSchema as object);

/** Clone the valid manifest and mutate it into an invalid shape. */
function invalid(mutate: (m: Record<string, unknown>) => void): unknown {
  const m = structuredClone(sampleManifest) as unknown as Record<string, unknown>;
  mutate(m);
  return m;
}

describe("manifestJsonSchema", () => {
  it("compiles as a valid JSON Schema", () => {
    expect(typeof validate).toBe("function");
  });

  it("accepts a well-formed manifest", () => {
    const ok = validate(sampleManifest satisfies PluginManifest);
    expect(validate.errors).toBeNull();
    expect(ok).toBe(true);
  });

  it("rejects a manifest missing a required field", () => {
    expect(validate(invalid((m) => delete m.capabilities))).toBe(false);
  });

  it("rejects an unknown capability", () => {
    expect(validate(invalid((m) => (m.capabilities = ["teleport"])))).toBe(false);
  });

  it("rejects a permission outside the allowed set", () => {
    expect(validate(invalid((m) => (m.permissions = ["filesystem"])))).toBe(false);
  });

  it("rejects an id that is not reverse-DNS", () => {
    expect(validate(invalid((m) => (m.id = "NotReverseDNS")))).toBe(false);
  });

  it("rejects a non-semver version", () => {
    expect(validate(invalid((m) => (m.version = "v1")))).toBe(false);
  });

  it("rejects an empty platforms array", () => {
    expect(validate(invalid((m) => (m.platforms = [])))).toBe(false);
  });

  it("rejects unknown top-level properties", () => {
    expect(validate(invalid((m) => (m.surprise = true)))).toBe(false);
  });
});
