"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Pin } from "@/lib/types";
import { PinButton } from "./PinButton";

type Props = {
  pin: Pin;
  cardId: string;
  editing: boolean;
  onEdit: () => void;
  onRemove: () => void;
};

export function SortablePin({ pin, cardId, editing, onEdit, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pin.id, data: { type: "pin", cardId } });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`touch-none ${isDragging ? "opacity-40" : ""}`}
      {...attributes}
      {...listeners}
    >
      <PinButton
        pin={pin}
        editing={editing}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    </div>
  );
}
