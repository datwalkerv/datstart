"use client";

import { useCallback, useRef, useState } from "react";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore } from "@/lib/store";
import { useClickOutside } from "@/lib/useClickOutside";
import type { Card, Pin } from "@/lib/types";
import { PinDialog } from "./PinDialog";
import { SortablePin } from "./SortablePin";

function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="6" cy="3.5" r="1.3" />
        <circle cx="10" cy="3.5" r="1.3" />
        <circle cx="6" cy="8" r="1.3" />
        <circle cx="10" cy="8" r="1.3" />
        <circle cx="6" cy="12.5" r="1.3" />
        <circle cx="10" cy="12.5" r="1.3" />
      </g>
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path
        d="M2 11.6 10.8 2.8a1.6 1.6 0 0 1 2.3 2.3L4.3 14 1.5 14.5 2 11.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkCard({ card }: { card: Card }) {
  const renameCard = useStore((s) => s.renameCard);
  const removeCard = useStore((s) => s.removeCard);
  const addPin = useStore((s) => s.addPin);
  const updatePin = useStore((s) => s.updatePin);
  const removePin = useStore((s) => s.removePin);
  const [editing, setEditing] = useState(false);
  const [dialogPin, setDialogPin] = useState<Pin | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card" } });

  const sectionRef = useRef<HTMLElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      setNodeRef(node);
    },
    [setNodeRef],
  );

  // Clicking anywhere outside the card leaves edit mode; the pin dialog is
  // portalled out of the card, so keep editing while it is open.
  const stopEditing = useCallback(() => setEditing(false), []);
  useClickOutside(sectionRef, editing && !dialogOpen, stopEditing);

  const openAdd = () => {
    setDialogPin(null);
    setDialogOpen(true);
  };

  const openEdit = (pin: Pin) => {
    setDialogPin(pin);
    setDialogOpen(true);
  };

  return (
    <section
      ref={setRefs}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`glass rounded-glass p-4 sm:p-5 ${isDragging ? "opacity-60" : ""}`}
    >
      <header className="mb-4 flex items-center gap-2">
        <button
          type="button"
          aria-label={`Reorder ${card.title}`}
          className="focus-ring -ml-1 cursor-grab touch-none rounded-lg p-1 text-fg-faint transition hover:text-fg active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripIcon />
        </button>

        {editing ? (
          <input
            value={card.title}
            onChange={(event) => renameCard(card.id, event.target.value)}
            aria-label="Card name"
            className="focus-ring min-w-0 flex-1 rounded-lg bg-black/25 px-2 py-1 font-serif text-lg text-fg"
          />
        ) : (
          <h2 className="min-w-0 flex-1 truncate font-serif text-lg">
            {card.title}
          </h2>
        )}

        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          aria-label={editing ? "Done editing" : `Edit ${card.title}`}
          aria-pressed={editing}
          className={`focus-ring grid size-7 place-items-center rounded-lg transition hover:bg-white/10 ${
            editing ? "text-accent" : "text-fg-faint"
          }`}
        >
          <PencilIcon />
        </button>

        {editing ? (
          <button
            type="button"
            onClick={() => removeCard(card.id)}
            className="focus-ring rounded-lg px-2 py-1 text-xs text-fg-dim transition hover:bg-white/10 hover:text-red-400"
          >
            Delete
          </button>
        ) : null}
      </header>

      <div className="flex flex-wrap gap-3">
        <SortableContext
          items={card.pins.map((pin) => pin.id)}
          strategy={rectSortingStrategy}
        >
          {card.pins.map((pin) => (
            <SortablePin
              key={pin.id}
              pin={pin}
              cardId={card.id}
              editing={editing}
              onEdit={() => openEdit(pin)}
              onRemove={() => removePin(card.id, pin.id)}
            />
          ))}
        </SortableContext>

        <button
          type="button"
          onClick={openAdd}
          aria-label={`Add pin to ${card.title}`}
          className="focus-ring grid size-14 place-items-center rounded-2xl border border-dashed border-white/20 text-fg-faint transition hover:border-accent/60 hover:text-accent"
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {dialogOpen ? (
        <PinDialog
          key={dialogPin?.id ?? "new"}
          pin={dialogPin}
          onClose={() => setDialogOpen(false)}
          onSubmit={(values) => {
            if (dialogPin) updatePin(card.id, dialogPin.id, values);
            else addPin(card.id, values);
          }}
        />
      ) : null}
    </section>
  );
}
