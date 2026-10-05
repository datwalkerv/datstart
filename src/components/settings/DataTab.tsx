"use client";

import { useRef, useState } from "react";
import { exportState, useStore } from "@/lib/store";
import {
  TextField,
  ghostButtonClass,
  primaryButtonClass,
} from "@/components/ui/controls";
import type { AppState } from "@/lib/types";

/** Saved on blur or Enter so the widget doesn't fetch on every keystroke. */
function ApiUrlField({
  label,
  hint,
  placeholder,
  apiUrl,
  onCommit,
}: {
  label: string;
  hint: string;
  placeholder: string;
  apiUrl: string;
  onCommit: (apiUrl: string) => void;
}) {
  const [draft, setDraft] = useState(apiUrl);
  const commit = () => onCommit(draft.trim());

  return (
    <TextField
      label={label}
      hint={hint}
      type="url"
      inputMode="url"
      placeholder={placeholder}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") commit();
      }}
    />
  );
}

export function DataTab() {
  const savingsApiUrl = useStore((s) => s.savings.apiUrl);
  const setSavings = useStore((s) => s.setSavings);
  const cryptoApiUrl = useStore((s) => s.crypto.apiUrl);
  const setCrypto = useStore((s) => s.setCrypto);
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

      {/* Keyed so an import or reset replaces the unsaved drafts. */}
      <div className="space-y-4 border-t border-white/10 pt-4">
        <ApiUrlField
          key={`savings:${savingsApiUrl}`}
          label="Savings API"
          hint="Returns { label: percent } pairs. Leave empty to hide the widget."
          placeholder="https://example.com/api/savings"
          apiUrl={savingsApiUrl}
          onCommit={(apiUrl) => setSavings({ apiUrl })}
        />
        <ApiUrlField
          key={`crypto:${cryptoApiUrl}`}
          label="Crypto API"
          hint="Returns SOL price, portfolio value and PnL %. Leave empty to hide the widget."
          placeholder="https://example.com/api/crypto/summary"
          apiUrl={cryptoApiUrl}
          onCommit={(apiUrl) => setCrypto({ apiUrl })}
        />
      </div>

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
