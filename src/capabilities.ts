/**
 * Contract version this SDK describes — **always** the package's major.minor
 * (e.g. package `0.2.3` → `API_VERSION` `"0.2"`).
 *
 * - **minor** (on `0.x`) / **major** (on `1.x+`) = contract changed → bump this
 *   with the package version.
 * - **patch** = no contract change → leave `API_VERSION` unchanged.
 *
 * A plugin's `manifest.apiVersion` must equal this string; the host refuses
 * anything else.
 */
export const API_VERSION = "0.2" as const;

/**
 * Optional features a plugin can support. Declared in the manifest *and*
 * implied by the presence of the matching method on the plugin object; the
 * host trusts the manifest for UI and validates at call time.
 */
export type Capability =
  | "search"
  | "catalog"
  | "vod"
  | "live"
  | "auth"
  | "library";

/** Host resources a plugin must request before `HostContext` grants them. */
export type Permission = "network" | "secureStorage";

/** Runtime targets a plugin declares support for. */
export type Platform = "tvos" | "androidtv" | "ios" | "android";

/**
 * Default per-call deadlines (milliseconds) the host enforces via `AbortSignal`.
 * Plugins should honor the signal and finish—or abort—within these budgets.
 */
export const DEFAULT_TIMEOUTS = {
  search: 5_000,
  getHomeRows: 8_000,
  getDetails: 8_000,
  getPlayback: 30_000,
  getLive: 8_000,
} as const satisfies Record<string, number>;

export type TimeoutKey = keyof typeof DEFAULT_TIMEOUTS;
