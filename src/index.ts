/**
 * @argus/plugin-sdk — the Argus plugin contract.
 *
 * Types, manifest schema, and the error taxonomy every provider plugin
 * implements. See ADR 0001 (TS-interface, in-process runtime).
 */

export { API_VERSION, DEFAULT_TIMEOUTS } from "./capabilities.js";
export type {
  Capability,
  Permission,
  Platform,
  TimeoutKey,
} from "./capabilities.js";

export type {
  MediaType,
  MediaId,
  Artwork,
  ProviderBadge,
  Person,
  MediaItem,
  MediaDetails,
  Season,
  Episode,
  LiveStatus,
  LiveEvent,
} from "./media.js";

export type {
  StreamType,
  DrmScheme,
  DrmInfo,
  SubtitleFormat,
  Subtitle,
  StreamDescriptor,
} from "./stream.js";

export type { SearchOptions, Row } from "./search.js";
export type { AuthStatus, AuthState, LoginFlow } from "./auth.js";
export type { Progress } from "./library.js";

export type {
  LogLevel,
  Logger,
  HttpRequestOptions,
  HttpResponse,
  HttpClient,
  SecureStore,
  KeyValueStore,
  SettingsAccess,
  HostContext,
} from "./host.js";

export type { PluginManifest, JsonSchema } from "./manifest.js";
export { manifestJsonSchema } from "./manifest.js";

export type { ArgusPlugin, PluginModule } from "./plugin.js";

export { ArgusError, isArgusError } from "./errors.js";
export type { ArgusErrorCode, ArgusErrorOptions } from "./errors.js";
