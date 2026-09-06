"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(
  date: Date,
  format24: boolean,
  showSeconds: boolean,
): { time: string; suffix: string } {
  const time = date.toLocaleTimeString(undefined, {
    hour: format24 ? "2-digit" : "numeric",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: !format24,
  });

  const match = time.match(/\s?([AP]M)$/i);
  if (match) {
    return { time: time.slice(0, match.index).trim(), suffix: match[1] };
  }
  return { time, suffix: "" };
}

export function Clock() {
  const hydrated = useHydrated();
  const { format24, showSeconds } = useStore((s) => s.clock);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const tick = () => setNow(new Date());
    let interval = 0;
    // Align to the next second so the display never visibly skips.
    const timeout = window.setTimeout(
      () => {
        tick();
        interval = window.setInterval(tick, 1000);
      },
      1000 - (Date.now() % 1000),
    );
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  const ready = hydrated && now !== null;
  const { time, suffix } = ready
    ? formatTime(now, format24, showSeconds)
    : { time: "--:--", suffix: "" };

  return (
    <div className="glass rounded-glass px-8 py-6 sm:px-12 sm:py-8 text-center">
      <p
        className="font-serif text-xl sm:text-2xl text-fg-dim"
        suppressHydrationWarning
      >
        {ready ? formatDate(now) : " "}
      </p>
      <p
        className="text-logo mt-1 text-6xl sm:text-7xl md:text-8xl tabular-nums leading-none"
        suppressHydrationWarning
      >
        {time}
        {suffix ? (
          <span className="ml-2 align-top text-2xl sm:text-3xl text-fg-dim">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}
