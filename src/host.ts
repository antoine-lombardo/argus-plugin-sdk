/**
 * Host-provided services. A plugin receives exactly one `HostContext` in
 * `initialize` and must not reach outside it—no access to host internals or
 * other plugins' namespaces.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export interface HttpRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
  headers?: Record<string, string>;
  body?: string | ArrayBuffer | Uint8Array;
  /** Overrides the host default per-request timeout (ms). */
  timeoutMs?: number;
  /** Cooperative cancellation, typically the same signal passed to the call. */
  signal?: AbortSignal;
}

export interface HttpResponse {
  status: number;
  ok: boolean;
  headers: Record<string, string>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  arrayBuffer(): Promise<ArrayBuffer>;
}

/** Host-managed fetch with timeout/retry and permission enforcement. */
export interface HttpClient {
  request(url: string, options?: HttpRequestOptions): Promise<HttpResponse>;
}

/** Per-plugin secure namespace (backed by the platform keychain). */
export interface SecureStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Per-plugin metadata cache / KV store. Not durable across reinstalls. */
export interface KeyValueStore {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Read access to user-configured plugin settings (per `settingsSchema`). */
export interface SettingsAccess {
  get<T = unknown>(key: string): T | undefined;
  all(): Record<string, unknown>;
}

export interface HostContext {
  /** Host-provided fetch with timeout/retry. */
  http: HttpClient;
  /** Per-plugin secure namespace. */
  secureStore: SecureStore;
  /** Per-plugin metadata cache. */
  cache: KeyValueStore;
  /** Structured logger forwarded to the host. */
  log: Logger;
  /** Reads user-set plugin settings. */
  settings: SettingsAccess;
}
