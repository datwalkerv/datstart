"use client";

import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { usePolledJson } from "@/lib/usePolledJson";

type Crypto = {
  solPrice: number | null;
  portfolio: number | null;
  pnl: number | null;
};

/** First finite number whose key contains `fragment`, ignoring case. */
function pick(data: object, fragment: string): number | null {
  for (const [key, value] of Object.entries(data)) {
    if (
      key.toLowerCase().includes(fragment) &&
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }
  }
  return null;
}

/** Matches keys loosely, e.g. "sol usd price", "portfolio value eur", "pnl%". */
function parseCrypto(data: unknown): Crypto | null {
  if (!data || typeof data !== "object") return null;
  const crypto = {
    solPrice: pick(data, "sol"),
    portfolio: pick(data, "portfolio"),
    pnl: pick(data, "pnl"),
  };
  return Object.values(crypto).some((v) => v !== null) ? crypto : null;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function Row({
  label,
  value,
  className = "text-fg",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[0.7rem] text-fg-dim">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${className}`}>
        {value}
      </span>
    </div>
  );
}

/** SOL price, portfolio value and PnL; renders nothing until an API URL is set. */
export function CryptoWidget() {
  const hydrated = useHydrated();
  const apiUrl = useStore((s) => s.crypto.apiUrl.trim());
  const crypto = usePolledJson(apiUrl, parseCrypto);

  if (!hydrated || !crypto) return null;
  const { solPrice, portfolio, pnl } = crypto;

  return (
    <div className="glass flex flex-col justify-center gap-2 rounded-3xl px-3.5 py-4">
      {solPrice !== null ? <Row label="SOL" value={usd.format(solPrice)} /> : null}
      {portfolio !== null ? (
        <Row label="Value" value={amount.format(portfolio)} />
      ) : null}
      {pnl !== null ? (
        <Row
          label="PnL"
          value={`${pnl > 0 ? "+" : ""}${pnl.toFixed(1)}%`}
          className={pnl < 0 ? "text-red-400" : "text-accent"}
        />
      ) : null}
    </div>
  );
}
