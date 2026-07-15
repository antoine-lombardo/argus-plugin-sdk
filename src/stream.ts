/** What the player shell needs to play an item. Plugins only *resolve* this. */

export type StreamType = "hls" | "dash" | "mp4";

export type DrmScheme = "widevine" | "fairplay";

export interface DrmInfo {
  scheme: DrmScheme;
  licenseUrl: string;
  /** Required for FairPlay. */
  certificateUrl?: string;
  headers?: Record<string, string>;
}

export type SubtitleFormat = "vtt" | "srt";

export interface Subtitle {
  url: string;
  /** BCP-47 language tag, e.g. "en", "fr-CA". */
  lang: string;
  format: SubtitleFormat;
  label?: string;
}

/** The host-owned player consumes this; it never sees provider internals. */
export interface StreamDescriptor {
  url: string;
  type: StreamType;
  drm?: DrmInfo;
  headers?: Record<string, string>;
  subtitles?: Subtitle[];
  live?: boolean;
  /** Resume position in seconds. */
  startPosition?: number;
}
