"use client";

import { SEARCH_ENGINES } from "@/components/search/engines";
import { Field, TextField, Toggle } from "@/components/ui/controls";
import { useStore } from "@/lib/store";

export function SearchTab() {
  const search = useStore((s) => s.search);
  const setSearch = useStore((s) => s.setSearch);

  return (
    <div className="space-y-5">
      <Field label="Default engine">
        <div className="grid grid-cols-2 gap-2">
          {SEARCH_ENGINES.map((engine) => (
            <button
              key={engine.id}
              type="button"
              onClick={() => setSearch({ engineId: engine.id })}
              aria-pressed={search.engineId === engine.id}
              className={`focus-ring rounded-xl border px-3 py-2 text-sm transition ${
                search.engineId === engine.id
                  ? "border-accent/60 bg-accent/10 font-semibold text-accent"
                  : "border-white/10 text-fg-dim hover:bg-white/5 hover:text-fg"
              }`}
            >
              {engine.name}
            </button>
          ))}
        </div>
      </Field>

      {search.engineId === "custom" ? (
        <TextField
          label="Custom search URL"
          hint="Use {q} where the query should go."
          placeholder="https://example.com/search?q={q}"
          value={search.customTemplate}
          onChange={(event) => setSearch({ customTemplate: event.target.value })}
        />
      ) : null}

      <Toggle
        label="Open results in a new tab"
        checked={search.openInNewTab}
        onChange={(openInNewTab) => setSearch({ openInNewTab })}
      />
    </div>
  );
}
