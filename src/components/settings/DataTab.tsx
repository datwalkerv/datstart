"use client";

import { useRef, useState } from "react";
import { exportState, useStore } from "@/lib/store";
import { ghostButtonClass, primaryButtonClass } from "@/components/ui/controls";
import type { AppState } from "@/lib/types";

export function DataTab() {
  const importState = useStore((s) => s.importState);
  const resetState = useStore((s) => s.resetState);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onExport = () => {
    const json = exportState(useStore.getState());
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "datstart-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as AppState;
      if (!Array.isArray(parsed.cards)) throw new Error("Invalid file");
      importState(parsed);
      setMessage("Settings imported.");
    } catch {
      setMessage("That file could not be read.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-fg-faint">
        Everything lives in this browser. Export a backup before switching
        browsers or clearing site data.
      </p>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onExport} className={primaryButtonClass}>
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={ghostButtonClass}
        >
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onImport(file);
            event.target.value = "";
          }}
        />
      </div>

      {message ? <p className="text-xs text-accent">{message}</p> : null}

      <div className="border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset datstart to its defaults?")) {
              resetState();
              setMessage("Reset to defaults.");
            }
          }}
          className="focus-ring rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-400/10"
        >
          Reset everything
        </button>
      </div>
    </div>
  );
}
