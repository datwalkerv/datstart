"use client";

import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { usePolledJson } from "@/lib/usePolledJson";

type Savings = Array<[label: string, percent: number]>;

const LABELS: Record<string, string> = { "10k": "10k", goal: "Goal" };

/** Reads `{ label: percent }` pairs, or null when the response is unusable. */
function parseSavings(data: unknown): Savings | null {
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
  const savings = usePolledJson(apiUrl, parseSavings);

  if (!hydrated || !savings) return null;

  return (
    <div className="glass flex gap-3 rounded-3xl px-3.5 py-4">
      {savings.map(([key, value]) => {
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
