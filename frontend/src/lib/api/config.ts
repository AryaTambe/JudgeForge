const configuredApiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

/** A public API origin, or an empty value to use same-origin /api routing. */
export const API_BASE_URL = configuredApiBase.replace(/\/+$/, "");
export const isApiConfigured = API_BASE_URL.length > 0;

/** Optional sample business data never replaces login or creates an identity. */
export const FIXTURE_DATA_ENABLED = process.env.NEXT_PUBLIC_FIXTURE_DATA === "1";

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}
