"use client";

import { useEffect, useState } from "react";
import { useStore } from "./store";

/**
 * True once the persisted store has been rehydrated from localStorage.
 * Render neutral placeholders until then to keep SSR markup stable.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useStore.persist;
    if (!persist) {
      setHydrated(true);
      return;
    }
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);

  return hydrated;
}
