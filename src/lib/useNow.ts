"use client";

import { useSyncExternalStore } from "react";

let cachedSecond = Math.floor(Date.now() / 1000);

/** Ticks once per second, shared by every subscriber. */
function subscribe(onChange: () => void): () => void {
  cachedSecond = Math.floor(Date.now() / 1000);
  let interval = 0;
  const tick = () => {
    cachedSecond = Math.floor(Date.now() / 1000);
    onChange();
  };
  // Align to the next whole second so the display never visibly skips.
  const timeout = window.setTimeout(() => {
    tick();
    interval = window.setInterval(tick, 1000);
  }, 1000 - (Date.now() % 1000));

  return () => {
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}

const getSnapshot = () => cachedSecond;
const getServerSnapshot = () => 0;

/** Current time as a Date, or null before the first client tick. */
export function useNow(): Date | null {
  const second = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return second === 0 ? null : new Date(second * 1000);
}
