/**
 * A minimal fixture plugin. Its only job is to *type-check* against
 * `ArgusPlugin`: if the contract changes in a breaking way, `tsc` fails here.
 * This is the compile-time half of the Phase 1 contract test.
 */
import type {
  ArgusPlugin,
  HostContext,
  MediaDetails,
  MediaId,
  MediaItem,
  PluginManifest,
  StreamDescriptor,
} from "../../src/index.js";
import { ArgusError } from "../../src/index.js";

export const sampleManifest: PluginManifest = {
  id: "com.example.sample",
  name: "Sample Provider",
  version: "0.1.0",
  build: 1,
  apiVersion: "0.1",
  entry: "index.js",
  capabilities: ["search", "catalog", "vod"],
  permissions: ["network"],
  platforms: ["tvos", "androidtv"],
  settingsSchema: { type: "object", properties: {} },
};

let host: HostContext | undefined;

const samplePlugin: ArgusPlugin = {
  manifest: sampleManifest,

  async initialize(ctx: HostContext): Promise<void> {
    host = ctx;
    host.log.info("sample plugin initialized");
  },

  async search(query: string, _opts, signal: AbortSignal): Promise<MediaItem[]> {
    if (signal.aborted) return [];
    return [
      {
        id: { pluginId: "com.example.sample", type: "movie", providerId: "1" },
        type: "movie",
        title: `Result for ${query}`,
        artwork: { poster: "https://example.com/p.jpg" },
        badges: [],
      },
    ];
  },

  async getDetails(id: MediaId): Promise<MediaDetails> {
    return {
      id,
      type: id.type,
      title: "Sample",
      artwork: {},
      overview: "A sample item.",
      genres: [],
      cast: [],
    };
  },

  async getPlayback(): Promise<StreamDescriptor> {
    throw new ArgusError("AUTH_REQUIRED", "Sign in to play this title.");
  },
};

export default samplePlugin;
