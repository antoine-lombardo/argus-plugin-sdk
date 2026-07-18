/** Typed error taxonomy plugins throw so the host can react consistently. */

export type ArgusErrorCode =
  | "AUTH_REQUIRED"
  | "GEO_BLOCKED"
  | "NOT_AVAILABLE"
  | "DRM_UNSUPPORTED"
  | "RATE_LIMITED"
  | "PLUGIN_ERROR";

export interface ArgusErrorOptions {
  /** Wrapped underlying error, preserved for host logging. */
  cause?: unknown;
  /** For `RATE_LIMITED`: suggested retry delay in seconds. */
  retryAfter?: number;
  /** Arbitrary structured context for diagnostics. */
  details?: Record<string, unknown>;
}

/**
 * Error a plugin throws to signal a well-known failure mode. The host maps
 * `code` to UX (e.g. `AUTH_REQUIRED` -> login prompt). Unknown throws are
 * treated as `PLUGIN_ERROR`.
 */
export class ArgusError extends Error {
  readonly code: ArgusErrorCode;
  readonly retryAfter?: number;
  readonly details?: Record<string, unknown>;

  constructor(code: ArgusErrorCode, message?: string, options: ArgusErrorOptions = {}) {
    super(message ?? code, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "ArgusError";
    this.code = code;
    if (options.retryAfter !== undefined) this.retryAfter = options.retryAfter;
    if (options.details !== undefined) this.details = options.details;
  }
}

const ARGUS_ERROR_CODES: ReadonlySet<string> = new Set([
  "AUTH_REQUIRED",
  "GEO_BLOCKED",
  "NOT_AVAILABLE",
  "DRM_UNSUPPORTED",
  "RATE_LIMITED",
  "PLUGIN_ERROR",
]);

/**
 * Narrowing helper for host code and tests.
 *
 * Uses duck-typing, not `instanceof`: plugins bundle their own copy of
 * `ArgusError`, so cross-bundle `instanceof` is always false.
 */
export function isArgusError(value: unknown): value is ArgusError {
  if (value instanceof ArgusError) return true;
  if (typeof value !== "object" || value === null) return false;
  const err = value as { name?: unknown; code?: unknown };
  return err.name === "ArgusError" && typeof err.code === "string" && ARGUS_ERROR_CODES.has(err.code);
}

/** Expected UX signals — do not trip a host circuit breaker. */
export const EXPECTED_ARGUS_ERROR_CODES: ReadonlySet<ArgusErrorCode> = new Set([
  "AUTH_REQUIRED",
  "GEO_BLOCKED",
  "NOT_AVAILABLE",
  "RATE_LIMITED",
  "DRM_UNSUPPORTED",
]);

export function isExpectedArgusError(value: unknown): boolean {
  return isArgusError(value) && EXPECTED_ARGUS_ERROR_CODES.has(value.code);
}
