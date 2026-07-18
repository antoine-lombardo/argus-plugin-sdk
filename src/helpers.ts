import type { ArgusPlugin } from "./plugin.js";
import type { MediaId, MediaType } from "./media.js";

/**
 * Identity helper for typed plugin modules. Prefer this over a bare
 * `export default { … }` so editors infer `ArgusPlugin` on the object.
 */
export function definePlugin(plugin: ArgusPlugin): ArgusPlugin {
  return plugin;
}

/** Build a `MediaId` for the calling plugin. */
export function mediaId(pluginId: string, type: MediaType, providerId: string): MediaId {
  return { pluginId, type, providerId };
}
