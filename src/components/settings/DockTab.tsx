"use client";

import { monogramIcon } from "@/lib/defaults";
import { useStore } from "@/lib/store";
import { inputClass, ghostButtonClass } from "@/components/ui/controls";

export function DockTab() {
  const dock = useStore((s) => s.dock);
  const addDockItem = useStore((s) => s.addDockItem);
  const updateDockItem = useStore((s) => s.updateDockItem);
  const removeDockItem = useStore((s) => s.removeDockItem);

  return (
    <div className="space-y-4">
      <p className="text-xs text-fg-faint">
        Point each tile at your app and drop in its icon URL — an SVG, PNG or a
        data URI all work.
      </p>

      <ul className="space-y-3">
        {dock.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-3"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.iconUrl}
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-lg object-cover"
              />
              <input
                value={item.label}
                onChange={(event) =>
                  updateDockItem(item.id, { label: event.target.value })
                }
                aria-label="App name"
                placeholder="Name"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeDockItem(item.id)}
                aria-label={`Remove ${item.label}`}
                className="focus-ring shrink-0 rounded-lg px-2 py-2 text-xs text-fg-dim transition hover:bg-white/10 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={item.url}
                onChange={(event) =>
                  updateDockItem(item.id, { url: event.target.value })
                }
                aria-label="App URL"
                placeholder="https://…"
                className={inputClass}
              />
              <input
                value={item.iconUrl}
                onChange={(event) =>
                  updateDockItem(item.id, { iconUrl: event.target.value })
                }
                aria-label="Icon URL"
                placeholder="Icon URL"
                className={inputClass}
              />
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() =>
          addDockItem({ label: "New app", url: "", iconUrl: monogramIcon("ap") })
        }
        className={ghostButtonClass}
      >
        + Add app
      </button>
    </div>
  );
}
