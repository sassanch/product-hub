export const DEFAULT_ALLOWED_DOMAIN = "plei.com";

type GoogleProfile = { email_verified?: boolean | null; hd?: string | null };

export function isAllowedGoogleProfile(
  profile: GoogleProfile | undefined,
  allowedDomain = process.env.AUTH_ALLOWED_DOMAIN || DEFAULT_ALLOWED_DOMAIN,
) {
  return profile?.email_verified === true && profile.hd?.toLowerCase() === allowedDomain.toLowerCase();
}

export function safeCallbackPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://product-hub.local");
    if (url.origin !== "https://product-hub.local") return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function isPublicAuthPath(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/api/auth/");
}
