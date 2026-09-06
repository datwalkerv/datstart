"use client";

import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { LinkCard } from "./LinkCard";

export function CardGrid() {
  const hydrated = useHydrated();
  const cards = useStore((s) => s.cards);
  const addCard = useStore((s) => s.addCard);

  if (!hydrated) {
    return <div className="h-56 w-full max-w-4xl" aria-hidden="true" />;
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <LinkCard key={card.id} card={card} />
        ))}
      </div>

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
