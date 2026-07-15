/**
 * Provider-agnostic media model. Plugins produce these DTOs and the host UI
 * renders them. Live and VOD are equally first-class.
 */

/** Kinds of content the host can represent. `channel` may land later. */
export type MediaType =
  | "movie"
  | "series"
  | "season"
  | "episode"
  | "liveEvent"
  | "channel";

/**
 * Globally unique reference to a piece of media.
 *
 * Renderable as `argus://{pluginId}/{type}/{providerId}`. `providerId` is
 * opaque to the host and only meaningful to the owning plugin.
 */
export interface MediaId {
  /** Id of the plugin that owns this item (matches `PluginManifest.id`). */
  pluginId: string;
  type: MediaType;
  /** Plugin-internal identifier for the item. */
  providerId: string;
}

/** Image URLs for an item. The host may cache but does not proxy in v1. */
export interface Artwork {
  poster?: string;
  backdrop?: string;
  logo?: string;
  thumbnail?: string;
}

/** A small provider marker shown on cards (e.g. "available on" badges). */
export interface ProviderBadge {
  pluginId: string;
  label: string;
  icon?: string;
}

/** A cast or crew member. */
export interface Person {
  name: string;
  role?: string;
  character?: string;
  photo?: string;
}

/** Lightweight item used in rows, grids, and search results. */
export interface MediaItem {
  id: MediaId;
  type: MediaType;
  title: string;
  artwork: Artwork;
  year?: number;
  /** Short one-line description for cards, when available. */
  tagline?: string;
  /** "Available on" markers when the same title is offered by multiple plugins. */
  badges: ProviderBadge[];
  /** Present for `liveEvent` items so cards can show status/time. */
  liveInfo?: LiveEvent;
}

/** Full metadata for a single item, loaded on the detail screen. */
export interface MediaDetails {
  id: MediaId;
  type: MediaType;
  title: string;
  artwork: Artwork;
  overview: string;
  genres: string[];
  cast: Person[];
  year?: number;
  runtime?: number;
  /** Present for `series`. */
  seasons?: Season[];
  /** Present for `liveEvent`. */
  liveInfo?: LiveEvent;
  badges?: ProviderBadge[];
}

export interface Season {
  number: number;
  title?: string;
  episodes: Episode[];
}

export interface Episode {
  id: MediaId;
  number: number;
  title: string;
  overview?: string;
  runtime?: number;
  artwork?: Artwork;
  airDate?: string;
}

export type LiveStatus = "upcoming" | "live" | "ended";

/** A live/broadcast event. Sports fields are optional hints for the UI. */
export interface LiveEvent {
  status: LiveStatus;
  /** ISO-8601 timestamps. */
  startsAt: string;
  endsAt?: string;
  league?: string;
  home?: string;
  away?: string;
  channel?: string;
}
