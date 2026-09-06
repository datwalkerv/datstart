import { DOCK_ITEMS } from "@/lib/dock";
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
        className="focus-ring block size-11 origin-bottom transition duration-200 ease-out will-change-transform group-hover/item:-translate-y-2 group-hover/item:scale-115 sm:size-12"
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

      <span className="glass-strong pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs opacity-0 transition group-hover/item:opacity-100">
        {item.label}
      </span>
    </li>
  );
}

/** Apps are configured in src/lib/dock.ts. */
export function Dock() {
  if (DOCK_ITEMS.length === 0) return null;

  return (
    <nav
      aria-label="Apps"
      className="fixed inset-x-0 bottom-4 z-20 flex justify-center sm:bottom-6"
    >
      {/* The scroller is padded so a lifted icon and its label are never
          clipped by the horizontal overflow. */}
      <div className="-mt-14 max-w-full overflow-x-auto px-4 pt-14">
        <ul className="glass mx-auto flex w-max items-end gap-2.5 rounded-3xl px-3 py-2.5 sm:gap-3">
          {DOCK_ITEMS.map((item) => (
            <DockTile key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}
