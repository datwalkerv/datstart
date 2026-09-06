"use client";

import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { normalizeUrl } from "@/lib/favicon";
import type { DockItem } from "@/lib/types";

function DockTile({ item }: { item: DockItem }) {
  const href = item.url ? normalizeUrl(item.url) : undefined;
  const Tag = href ? "a" : "span";

  return (
    <li className="group/item relative">
      <Tag
        {...(href ? { href } : {})}
        title={item.label}
        aria-label={item.label}
        className="focus-ring block size-11 sm:size-12 origin-bottom transition duration-200 ease-out will-change-transform group-hover/item:-translate-y-2 group-hover/item:scale-115"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.iconUrl}
          alt=""
          width={48}
          height={48}
          className="size-full rounded-[0.85rem] object-cover shadow-lg"
          draggable={false}
        />
      </Tag>

      <span className="glass-strong pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs opacity-0 transition group-hover/item:opacity-100">
        {item.label}
      </span>
    </li>
  );
}

export function Dock() {
  const hydrated = useHydrated();
  const dock = useStore((s) => s.dock);

  if (!hydrated || dock.length === 0) return null;

  return (
    <nav
      aria-label="Apps"
      className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 px-4 sm:bottom-6"
    >
      <ul className="glass group flex max-w-[calc(100vw-2rem)] items-end gap-2.5 overflow-x-auto rounded-3xl px-3 py-2.5 sm:gap-3">
        {dock.map((item) => (
          <DockTile key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
}
