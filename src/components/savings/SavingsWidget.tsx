"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

type Savings = Array<[label: string, percent: number]>;

const REFRESH_MS = 15 * 60 * 1000;

const LABELS: Record<string, string> = { "10k": "10k", goal: "Goal" };

/** Reads `{ label: percent }` pairs, or null when the response is unusable. */
async function fetchSavings(url: string): Promise<Savings | null> {
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = (await response.json()) as unknown;
  if (!data || typeof data !== "object") return null;
  const entries = Object.entries(data).filter(
    (entry): entry is [string, number] =>
      typeof entry[1] === "number" && Number.isFinite(entry[1]),
  );
  return entries.length ? entries : null;
}

/** Savings progress bars; renders nothing until an API URL is set in Settings. */
export function SavingsWidget() {
  const hydrated = useHydrated();
  const apiUrl = useStore((s) => s.savings.apiUrl.trim());
  const [result, setResult] = useState<{ url: string; data: Savings } | null>(
    null,
  );

  useEffect(() => {
    if (!apiUrl) return;
    let cancelled = false;

    const run = () =>
      fetchSavings(apiUrl)
        .catch(() => null)
        .then((data) => {
          if (cancelled) return;
          setResult(data ? { url: apiUrl, data } : null);
        });

    void run();
    const interval = window.setInterval(() => void run(), REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [apiUrl]);

  // Results from a previous URL are ignored until the new one responds.
  if (!hydrated || !apiUrl || result?.url !== apiUrl) return null;

  return (
    <div className="glass flex gap-3 self-end rounded-3xl px-3.5 py-4">
      {result.data.map(([key, value]) => {
        const percent = Math.min(100, Math.max(0, value));
        return (
          <div key={key} className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold tabular-nums text-fg">
              {Math.round(value)}%
            </span>
            <div
              role="progressbar"
              aria-label={LABELS[key] ?? key}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="flex h-20 w-2.5 items-end overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="w-full rounded-full bg-accent"
                style={{ height: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
