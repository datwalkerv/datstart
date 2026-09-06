"use client";

import { useState } from "react";
import { faviconUrl, normalizeUrl, siteName } from "@/lib/favicon";
import type { Pin } from "@/lib/types";

type Props = {
  pin: Pin;
  editing: boolean;
  onEdit: () => void;
  onRemove: () => void;
};

export function PinButton({ pin, editing, onEdit, onRemove }: Props) {
  const [failed, setFailed] = useState(false);
  const icon = pin.iconUrl || faviconUrl(pin.url);
  const showIcon = Boolean(icon) && !failed;
  // The name is optional: when unset, the pin is just its icon.
  const label = pin.title.trim();
  const fallbackName = label || siteName(pin.url);

  return (
    <div className="group relative flex w-16 flex-col items-center gap-1.5">
      <a
        href={normalizeUrl(pin.url)}
        title={fallbackName}
        onClick={(event) => {
          if (editing) {
            event.preventDefault();
            onEdit();
          }
        }}
        className="focus-ring glass glass-hover grid size-14 place-items-center rounded-2xl transition hover:-translate-y-0.5 hover:accent-glow"
      >
        {showIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon as string}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-md"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="text-logo text-lg text-accent">
            {fallbackName.slice(0, 1).toUpperCase() || "?"}
          </span>
        )}
      </a>

      {label ? (
        <span className="line-clamp-1 w-full text-center text-[0.7rem] text-fg-dim">
          {label}
        </span>
      ) : null}

      {editing ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${fallbackName}`}
          className="focus-ring absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-black text-fg-dim ring-1 ring-white/20 transition hover:text-accent"
        >
          <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true">
            <path
              d="M1 1l8 8M9 1l-8 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
