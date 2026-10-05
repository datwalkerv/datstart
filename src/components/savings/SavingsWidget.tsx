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
    <div className="glass flex min-w-54 flex-col gap-2.5 rounded-3xl px-4 py-3 text-left">
      {result.data.map(([key, value]) => {
        const percent = Math.min(100, Math.max(0, value));
        const label = LABELS[key] ?? key;
        return (
          <div key={key}>
            <div className="flex items-baseline justify-between text-xs font-semibold">
              <span className="text-fg-dim">{label}</span>
              <span className="tabular-nums text-fg">{value.toFixed(1)}%</span>
            </div>
            <div
              role="progressbar"
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
