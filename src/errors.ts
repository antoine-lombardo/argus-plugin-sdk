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

/** Narrowing helper for host code and tests. */
export function isArgusError(value: unknown): value is ArgusError {
  return value instanceof ArgusError;
}
