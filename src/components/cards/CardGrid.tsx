"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import type { Card } from "@/lib/types";
import { LinkCard } from "./LinkCard";

function findCardOfPin(cards: Card[], pinId: string): Card | undefined {
  return cards.find((card) => card.pins.some((pin) => pin.id === pinId));
}

export function CardGrid() {
  const hydrated = useHydrated();
  const cards = useStore((s) => s.cards);
  const addCard = useStore((s) => s.addCard);
  const reorderCards = useStore((s) => s.reorderCards);
  const reorderPins = useStore((s) => s.reorderPins);
  const movePin = useStore((s) => s.movePin);

  // A small drag threshold keeps pin links clickable.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const activeType = active.data.current?.type;

    if (activeType === "card") {
      const from = cards.findIndex((card) => card.id === active.id);
      const to = cards.findIndex((card) => card.id === over.id);
      if (from !== -1 && to !== -1) reorderCards(from, to);
      return;
    }

    if (activeType !== "pin") return;

    const sourceCard = findCardOfPin(cards, String(active.id));
    if (!sourceCard) return;

    const overIsCard = over.data.current?.type === "card";
    const targetCard = overIsCard
      ? cards.find((card) => card.id === over.id)
      : findCardOfPin(cards, String(over.id));
    if (!targetCard) return;

    const fromIndex = sourceCard.pins.findIndex((pin) => pin.id === active.id);
    const toIndex = overIsCard
      ? targetCard.pins.length
      : targetCard.pins.findIndex((pin) => pin.id === over.id);

    if (sourceCard.id === targetCard.id) {
      reorderPins(sourceCard.id, fromIndex, toIndex);
    } else {
      movePin(sourceCard.id, targetCard.id, String(active.id), toIndex);
    }
  };

  if (!hydrated) {
    return <div className="h-56 w-full max-w-4xl" aria-hidden="true" />;
  }

  return (
    <div className="w-full max-w-4xl">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <LinkCard key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => addCard("New card")}
          className="focus-ring rounded-full border border-dashed border-white/20 px-4 py-2 text-sm text-fg-faint transition hover:border-accent/60 hover:text-accent"
        >
          + Add card
        </button>
      </div>
    </div>
  );
}
