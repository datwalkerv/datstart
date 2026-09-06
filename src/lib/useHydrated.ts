"use client";

import { useEffect, useState } from "react";
import { useStore } from "./store";

/**
 * True once the persisted store has been rehydrated from localStorage.
 * Render neutral placeholders until then to keep SSR markup stable.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    useStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubFinish = useStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsubFinish;
  }, []);

  return hydrated;
}
