"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  TextField,
  ghostButtonClass,
  primaryButtonClass,
} from "@/components/ui/controls";
import { siteName } from "@/lib/favicon";
import type { Pin } from "@/lib/types";

type Props = {
  /** The pin being edited, or null when adding a new one. */
  pin: Pin | null;
  onClose: () => void;
  onSubmit: (values: { title: string; url: string; iconUrl?: string }) => void;
};

/** Mount this only while the dialog is open, keyed by pin id. */
export function PinDialog({ pin, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(pin?.title ?? "");
  const [url, setUrl] = useState(pin?.url ?? "");
  const [iconUrl, setIconUrl] = useState(pin?.iconUrl ?? "");

  const submit = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      onClose();
      return;
    }
    onSubmit({
      title: title.trim() || siteName(trimmedUrl),
      url: trimmedUrl,
      iconUrl: iconUrl.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal
      open
      title={pin ? "Edit pin" : "Add pin"}
      onClose={onClose}
      onBackdropClose={submit}
    >
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <TextField
          label="URL"
          placeholder="github.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <TextField
          label="Name"
          placeholder="Optional"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          label="Icon URL"
          hint="Leave empty to use the site's favicon."
          placeholder="Optional"
          value={iconUrl}
          onChange={(event) => setIconUrl(event.target.value)}
        />
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={ghostButtonClass}>
            Cancel
          </button>
          <button type="submit" className={primaryButtonClass}>
            {pin ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
