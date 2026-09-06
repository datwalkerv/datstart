"use client";

import { useSyncExternalStore } from "react";
import { useStore } from "./store";

function subscribe(onChange: () => void): () => void {
  return useStore.persist?.onFinishHydration(onChange) ?? (() => {});
}

const getSnapshot = () => useStore.persist?.hasHydrated() ?? true;
const getServerSnapshot = () => false;

/**
 * True once the persisted store has been rehydrated from localStorage.
 * Render neutral placeholders until then to keep SSR markup stable.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
