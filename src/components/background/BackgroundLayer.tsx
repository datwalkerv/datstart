"use client";

import { useEffect, useState } from "react";
import { getAsset } from "@/lib/idb";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import type { BackgroundSettings } from "@/lib/types";

/** Resolves an uploaded background from IndexedDB into an object URL. */
function useUploadedImage(idbKey: string | null): string | null {
  const [entry, setEntry] = useState<{ key: string; url: string } | null>(null);

  useEffect(() => {
    if (!idbKey) return;
    let objectUrl: string | null = null;
    let cancelled = false;

    void getAsset(idbKey)
      .then((blob) => {
        if (cancelled || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setEntry({ key: idbKey, url: objectUrl });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [idbKey]);

  // Ignore a stale object URL from a previously selected image.
  return entry && entry.key === idbKey ? entry.url : null;
}

function backgroundStyle(
  background: BackgroundSettings,
  uploadedUrl: string | null,
): React.CSSProperties {
  if (background.kind === "color") {
    return { backgroundColor: background.color };
  }
  if (background.kind === "gradient") {
    const { from, to, angle } = background.gradient;
    return { backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})` };
  }

  const src =
    background.imageSource === "upload" ? uploadedUrl : background.url.trim();
  if (!src) return { backgroundColor: background.color };

  return {
    backgroundImage: `url("${src.replace(/"/g, "%22")}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export function BackgroundLayer() {
  const hydrated = useHydrated();
  const background = useStore((s) => s.background);
  const uploadedUrl = useUploadedImage(
    background.kind === "image" && background.imageSource === "upload"
      ? background.idbKey
      : null,
  );

  if (!hydrated) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg-0">
      <div
        className="absolute -inset-8 bg-bg-0"
        style={{
          ...backgroundStyle(background, uploadedUrl),
          filter: background.blur > 0 ? `blur(${background.blur}px)` : undefined,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${background.dim})` }}
      />
    </div>
  );
}
