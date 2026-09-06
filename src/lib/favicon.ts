/** Best-effort favicon URL for a site, resolved through Google's icon service. */
export function faviconUrl(url: string, size = 128): string | null {
  const host = hostOf(url);
  if (!host) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
}

export function hostOf(url: string): string | null {
  try {
    return new URL(normalizeUrl(url)).hostname;
  } catch {
    return null;
  }
}

/** Accepts "example.com" as readily as "https://example.com/path". */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** A short display name for a site, e.g. "github" for github.com. */
export function siteName(url: string): string {
  const host = hostOf(url);
  if (!host) return url;
  const parts = host.replace(/^www\./, "").split(".");
  return parts[0] ?? host;
}
