"use client";

import type { ReactNode } from "react";
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

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[0.7rem] text-fg-dim">{label}</span>
      <span className="text-xs font-semibold tabular-nums">{children}</span>
    </div>
  );
}

/** PnL percentage, swapped for the portfolio value while hovered or focused. */
function PnlValue({
  pnl,
  portfolio,
}: {
  pnl: number;
  portfolio: number | null;
}) {
  const percent = (
    <span className={pnl < 0 ? "text-red-400" : "text-accent"}>
      {pnl > 0 ? "+" : ""}
      {pnl.toFixed(1)}%
    </span>
  );
  if (portfolio === null) return percent;

  return (
    <span
      tabIndex={0}
      className="group focus-ring cursor-default rounded-sm"
      aria-label={`PnL ${pnl.toFixed(1)}%, portfolio ${amount.format(portfolio)}`}
    >
      <span className="group-hover:hidden group-focus:hidden">{percent}</span>
      <span className="hidden text-fg group-hover:inline group-focus:inline">
        {amount.format(portfolio)}
      </span>
    </span>
  );
}

/** SOL price and PnL; renders nothing until an API URL is set in Settings. */
export function CryptoWidget() {
  const hydrated = useHydrated();
  const apiUrl = useStore((s) => s.crypto.apiUrl.trim());
  const crypto = usePolledJson(apiUrl, parseCrypto);

  if (!hydrated || !crypto) return null;
  const { solPrice, portfolio, pnl } = crypto;

  return (
    <div className="glass flex flex-col gap-2 rounded-3xl px-3.5 py-4">
      {solPrice !== null ? (
        <Row label="SOL">
          <span className="text-fg">{usd.format(solPrice)}</span>
        </Row>
      ) : null}
      {pnl !== null ? (
        <Row label="PnL">
          <PnlValue pnl={pnl} portfolio={portfolio} />
        </Row>
      ) : null}
    </div>
  );
}
