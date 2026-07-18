import type { Capability, Permission, Platform } from "./capabilities.js";

/**
 * Metadata shipped in a plugin's `manifest.json`. The host reads this before
 * loading code: to check `apiVersion` compatibility, show permissions at install
 * time, gate capabilities in the UI, and render the settings form.
 */
export interface PluginManifest {
  /** Reverse-DNS unique id, e.g. "com.example.provider". */
  id: string;
  name: string;
  /** Plugin's own semver. */
  version: string;
  /**
   * Monotonic build within `version`. Host update checks use (version, build):
   * higher semver wins, or same semver with higher build.
   */
  build: number;
  /** Contract version the plugin targets (see `API_VERSION`). */
  apiVersion: string;
  /** Bundle entry file inside the artifact. */
  entry: string;
  capabilities: Capability[];
  permissions: Permission[];
  platforms: Platform[];
  /** JSON Schema describing user-configurable settings; host renders the form. */
  settingsSchema?: JsonSchema;
  /** Path to an icon inside the artifact's `assets/`. */
  icon?: string;
  description?: string;
  author?: string;
  homepage?: string;
}

/** Minimal JSON Schema shape used for `settingsSchema` (kept loose on purpose). */
export interface JsonSchema {
  type?: string;
  properties?: Record<string, unknown>;
  required?: string[];
  [key: string]: unknown;
}

/**
 * JSON Schema (draft 2020-12) for validating a `manifest.json`. Exported as data
 * so host/signing tooling can validate manifests with a runtime validator
 * (e.g. Ajv) without importing TypeScript types.
 */
export const manifestJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://argus.app/schemas/plugin-manifest.json",
  title: "PluginManifest",
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "name",
    "version",
    "build",
    "apiVersion",
    "entry",
    "capabilities",
    "permissions",
    "platforms",
  ],
  properties: {
    id: { type: "string", pattern: "^[a-z0-9]+(\\.[a-z0-9-]+)+$" },
    name: { type: "string", minLength: 1 },
    version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+" },
    build: { type: "integer", minimum: 1 },
    apiVersion: { type: "string", pattern: "^\\d+\\.\\d+$" },
    entry: { type: "string", minLength: 1 },
    capabilities: {
      type: "array",
      items: {
        type: "string",
        enum: ["search", "catalog", "vod", "live", "auth", "library"],
      },
      uniqueItems: true,
    },
    permissions: {
      type: "array",
      items: { type: "string", enum: ["network", "secureStorage"] },
      uniqueItems: true,
    },
    platforms: {
      type: "array",
      items: {
        type: "string",
        enum: ["tvos", "androidtv", "ios", "android"],
      },
      uniqueItems: true,
      minItems: 1,
    },
    settingsSchema: { type: "object" },
    icon: { type: "string" },
    description: { type: "string" },
    author: { type: "string" },
    homepage: { type: "string" },
  },
} as const;
