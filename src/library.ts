import type { MediaId } from "./media.js";

/**
 * Playback progress for continue-watching. The host merges host-side and
 * plugin-side progress; the max position across sources wins.
 */
export interface Progress {
  id: MediaId;
  /** Watched position in seconds. */
  position: number;
  /** Total duration in seconds, when known. */
  duration?: number;
  /** Epoch millis of the last update, used for merge/reconciliation. */
  updatedAt: number;
  /** True once the item is considered finished. */
  completed?: boolean;
}
