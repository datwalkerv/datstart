"use client";

import { useState } from "react";
import { SettingsPanel } from "./SettingsPanel";

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.6 5.4l-1.6 1.6M7 17l-1.6 1.6M18.6 18.6 17 17M7 7 5.4 5.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open settings"
        className="focus-ring glass glass-hover fixed bottom-5 right-5 z-30 grid size-11 place-items-center rounded-full text-fg-dim hover:rotate-45 hover:text-accent sm:bottom-6 sm:right-6"
      >
        <GearIcon />
      </button>
      {open ? <SettingsPanel onClose={() => setOpen(false)} /> : null}
    </>
  );
}
