/** Authentication types for plugins that declare the `auth` capability. */

export type AuthStatus = "signedOut" | "signedIn" | "expired";

export interface AuthState {
  status: AuthStatus;
  /** Optional display name / handle for the signed-in account. */
  account?: string;
  /** Epoch millis when the current session expires, if known. */
  expiresAt?: number;
}

/**
 * How the host should drive a login. Plugins choose the flow their provider
 * supports; the host renders the matching UI.
 */
export type LoginFlow =
  | { kind: "usernamePassword"; username: string; password: string }
  | { kind: "deviceCode" }
  | { kind: "token"; token: string };
