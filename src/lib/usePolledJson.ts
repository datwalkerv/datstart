"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 15 * 60 * 1000;

/**
 * Fetches JSON from `url` and refreshes it periodically. `parse` turns the
 * response into display data, returning null when it is unusable. Returns null
 * while loading, on failure, or when `url` is empty.
 */
export function usePolledJson<T>(
  url: string,
  parse: (data: unknown) => T | null,
): T | null {
  const [result, setResult] = useState<{ url: string; data: T } | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const run = () =>
      fetch(url)
        .then((response) => (response.ok ? response.json() : null))
        .then((json: unknown) => (json == null ? null : parse(json)))
        .catch(() => null)
        .then((data) => {
          if (cancelled) return;
          setResult(data ? { url, data } : null);
        });

    void run();
    const interval = window.setInterval(() => void run(), REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [url, parse]);

  // Results from a previous URL are ignored until the new one responds.
  return url && result?.url === url ? result.data : null;
}
