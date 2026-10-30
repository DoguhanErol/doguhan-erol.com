import { shouldUseSecureCookies } from "./deploy-env";

/** Her cihaz kendi çerezini taşır. Çıkış yalnızca o tarayıcıyı kapatır. */
export const AUTH_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;
export const AUTH_SESSION_UPDATE_AGE_SEC = 60 * 60 * 24;

export function getAuthSessionCookieName(): string {
  return shouldUseSecureCookies()
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
}

export function getAuthSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: shouldUseSecureCookies(),
  };
}
