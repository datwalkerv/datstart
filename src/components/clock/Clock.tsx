"use client";

import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { useNow } from "@/lib/useNow";

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

/** One pass of the numerals; three of these stack to make the glass. */
function Layer({ className, time }: { className: string; time: string }) {
  return (
    <span
      className={`clock-layer ${className} text-[clamp(4.5rem,17vw,10rem)]`}
      suppressHydrationWarning
    >
      {time}
    </span>
  );
}

export function Clock() {
  const hydrated = useHydrated();
  const { format24, showSeconds } = useStore((s) => s.clock);
  const now = useNow();

  const ready = hydrated && now !== null;
  const { time, suffix } = ready
    ? formatTime(now, format24, showSeconds)
    : { time: "--:--", suffix: "" };

  return (
    <div className="text-center">
      <p
        className="text-[clamp(1.05rem,3.4vw,1.6rem)] font-semibold tracking-tight text-white/90 [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]"
        suppressHydrationWarning
      >
        {ready ? formatDate(now) : " "}
      </p>

      <div className="clock-stack mt-1">
        <Layer className="clock-fill" time={time} />
        <Layer className="clock-gloss" time={time} />
        <Layer className="clock-rim" time={time} />
      </div>

      {suffix ? (
        <p className="-mt-1 text-lg font-semibold text-white/70">{suffix}</p>
      ) : null}
    </div>
  );
}
