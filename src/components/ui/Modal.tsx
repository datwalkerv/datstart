"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/lib/useMounted";

type Props = {
  open: boolean;
  title: string;
  /** Called on Escape and by the close button. */
  onClose: () => void;
  /** Called when the backdrop is clicked. Defaults to `onClose`. */
  onBackdropClose?: () => void;
  children: ReactNode;
};

export function Modal({
  open,
  title,
  onClose,
  onBackdropClose,
  children,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Portalled to <body> so an ancestor transform (a dragging card) cannot
  // capture the fixed positioning or clip the dialog.
  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          (onBackdropClose ?? onClose)();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-strong w-full max-w-sm rounded-3xl p-5"
      >
        <h2 className="font-serif text-xl">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
