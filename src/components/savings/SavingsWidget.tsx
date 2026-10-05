type Savings = Record<string, number>;

const REVALIDATE_S = 15 * 60;

const LABELS: Record<string, string> = { "10k": "10k", goal: "Goal" };

/** Fetches progress percentages, or null when unconfigured or unreachable. */
async function fetchSavings(): Promise<Savings | null> {
  const url = process.env.SAVINGS_API;
  if (!url) return null;
  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_S } });
    if (!response.ok) return null;
    const data = (await response.json()) as unknown;
    if (!data || typeof data !== "object") return null;
    const entries = Object.entries(data).filter(
      (entry): entry is [string, number] =>
        typeof entry[1] === "number" && Number.isFinite(entry[1]),
    );
    return entries.length ? Object.fromEntries(entries) : null;
  } catch {
    return null;
  }
}

/** Savings progress bars; renders nothing unless SAVINGS_API is set. */
export async function SavingsWidget() {
  const savings = await fetchSavings();
  if (!savings) return null;

  return (
    <div className="glass flex min-w-54 flex-col gap-2.5 rounded-3xl px-4 py-3 text-left">
      {Object.entries(savings).map(([key, value]) => {
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
