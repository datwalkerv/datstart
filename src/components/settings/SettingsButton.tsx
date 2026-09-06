"use client";

import { useState } from "react";
import { SettingsPanel } from "./SettingsPanel";

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 5.7a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Z"
      />
      <path
        fill="currentColor"
        d="M20.3 13.5a8.6 8.6 0 0 0 0-3l1.5-1.2a.75.75 0 0 0 .18-.95l-1.6-2.7a.75.75 0 0 0-.9-.33l-1.8.7a8.4 8.4 0 0 0-2.6-1.5l-.28-1.9a.75.75 0 0 0-.74-.62h-3.2a.75.75 0 0 0-.74.62l-.28 1.9a8.4 8.4 0 0 0-2.6 1.5l-1.8-.7a.75.75 0 0 0-.9.33l-1.6 2.7a.75.75 0 0 0 .18.95l1.5 1.2a8.6 8.6 0 0 0 0 3l-1.5 1.2a.75.75 0 0 0-.18.95l1.6 2.7c.17.3.53.43.9.33l1.8-.7a8.4 8.4 0 0 0 2.6 1.5l.28 1.9c.05.36.37.62.74.62h3.2c.37 0 .69-.26.74-.62l.28-1.9a8.4 8.4 0 0 0 2.6-1.5l1.8.7c.37.1.73-.03.9-.33l1.6-2.7a.75.75 0 0 0-.18-.95l-1.5-1.2Zm-1.6-2.8a7 7 0 0 1 0 2.6l-.12.7 1.62 1.28-.98 1.66-1.92-.75-.55.46a6.9 6.9 0 0 1-2.15 1.25l-.67.24-.3 2.03h-1.96l-.3-2.03-.67-.24a6.9 6.9 0 0 1-2.15-1.25l-.55-.46-1.92.75-.98-1.66 1.62-1.28-.12-.7a7 7 0 0 1 0-2.6l.12-.7L5.2 8.75l.98-1.66 1.92.75.55-.46a6.9 6.9 0 0 1 2.15-1.25l.67-.24.3-2.03h1.96l.3 2.03.67.24c.79.29 1.51.71 2.15 1.25l.55.46 1.92-.75.98 1.66-1.62 1.28.12.7Z"
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
