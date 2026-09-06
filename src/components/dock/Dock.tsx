"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { normalizeUrl } from "@/lib/favicon";
import type { DockItem } from "@/lib/types";

function DockTile({ item }: { item: DockItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const href = item.url ? normalizeUrl(item.url) : undefined;
  const Tag = href ? "a" : "span";

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`group/item relative touch-none ${isDragging ? "opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
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

      <span className="glass-strong pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs opacity-0 transition group-hover/item:opacity-100">
        {item.label}
      </span>
    </li>
  );
}

export function Dock() {
  const hydrated = useHydrated();
  const dock = useStore((s) => s.dock);
  const reorderDock = useStore((s) => s.reorderDock);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = dock.findIndex((item) => item.id === active.id);
    const to = dock.findIndex((item) => item.id === over.id);
    if (from !== -1 && to !== -1) reorderDock(from, to);
  };

  if (!hydrated || dock.length === 0) return null;

  return (
    <nav
      aria-label="Apps"
      className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 px-4 sm:bottom-6"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={dock.map((item) => item.id)} strategy={horizontalListSortingStrategy}>
          <ul className="glass group flex max-w-[calc(100vw-2rem)] items-end gap-2.5 overflow-x-auto rounded-3xl px-3 py-2.5 sm:gap-3">
            {dock.map((item) => (
              <DockTile key={item.id} item={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </nav>
  );
}
