"use client";

import { useEffect, useState } from "react";
import { AppearanceTab } from "./AppearanceTab";
import { DataTab } from "./DataTab";
import { DockTab } from "./DockTab";
import { SearchTab } from "./SearchTab";

const TABS = [
  { id: "appearance", label: "Appearance" },
  { id: "search", label: "Search" },
  { id: "dock", label: "Dock" },
  { id: "data", label: "Data" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<TabId>("appearance");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/40"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="glass-strong flex h-full w-full max-w-md flex-col rounded-l-3xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
          <h2 className="text-logo text-xl">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="focus-ring grid size-8 place-items-center rounded-full text-fg-dim transition hover:bg-white/10 hover:text-fg"
          >
            <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id}
              className={`focus-ring shrink-0 rounded-xl px-3 py-1.5 text-sm transition ${
                tab === item.id
                  ? "bg-white/10 font-semibold text-accent"
                  : "text-fg-dim hover:text-fg"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "appearance" ? <AppearanceTab /> : null}
          {tab === "search" ? <SearchTab /> : null}
          {tab === "dock" ? <DockTab /> : null}
          {tab === "data" ? <DataTab /> : null}
        </div>
      </aside>
    </div>
  );
}
