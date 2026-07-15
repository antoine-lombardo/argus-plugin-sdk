import type { MediaItem, MediaType } from "./media.js";

/** Options passed to `ArgusPlugin.search`. */
export interface SearchOptions {
  /** Restrict results to these media types, when set. */
  types?: MediaType[];
  /** Max results the host wants back (a hint, not a guarantee). */
  limit?: number;
  /** BCP-47 UI language for localized results. */
  locale?: string;
}

/** A titled, horizontally-scrolling row for the home screen. */
export interface Row {
  id: string;
  title: string;
  items: MediaItem[];
}
