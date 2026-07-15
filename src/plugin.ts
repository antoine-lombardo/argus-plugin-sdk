import type { HostContext } from "./host.js";
import type { PluginManifest } from "./manifest.js";
import type { MediaDetails, MediaId, MediaItem, LiveEvent } from "./media.js";
import type { Row, SearchOptions } from "./search.js";
import type { StreamDescriptor } from "./stream.js";
import type { AuthState, LoginFlow } from "./auth.js";
import type { Progress } from "./library.js";

/**
 * The contract every provider plugin implements. A plugin bundle default-exports
 * an object satisfying this interface; the host holds a typed reference and calls
 * methods directly (in-process, see ADR 0001).
 *
 * Capability-gated methods are optional: presence implies support and must match
 * the `capabilities` declared in the manifest. All methods are async, and any
 * method taking an `AbortSignal` should honor it and respect the host timeouts
 * in `DEFAULT_TIMEOUTS`.
 */
export interface ArgusPlugin {
  readonly manifest: PluginManifest;

  /** Called once after load, before any other method. */
  initialize(ctx: HostContext): Promise<void>;
  /** Optional teardown when the plugin is disabled/unloaded. */
  dispose?(): Promise<void>;

  // --- Discovery (capability: search / catalog) ---
  search?(query: string, opts: SearchOptions, signal: AbortSignal): Promise<MediaItem[]>;
  getHomeRows?(signal: AbortSignal): Promise<Row[]>;
  getDetails?(id: MediaId, signal: AbortSignal): Promise<MediaDetails>;

  // --- Playback (capability: vod / live) ---
  getPlayback?(id: MediaId, signal: AbortSignal): Promise<StreamDescriptor>;
  getLive?(signal: AbortSignal): Promise<LiveEvent[]>;

  // --- Auth (capability: auth) ---
  getAuthState?(): Promise<AuthState>;
  login?(flow: LoginFlow): Promise<AuthState>;
  logout?(): Promise<void>;

  // --- Library (capability: library) ---
  getContinueWatching?(signal: AbortSignal): Promise<Progress[]>;
  reportProgress?(p: Progress): Promise<void>;
}

/** A plugin bundle's `index.js` default-exports an `ArgusPlugin`. */
export type PluginModule = { default: ArgusPlugin };
