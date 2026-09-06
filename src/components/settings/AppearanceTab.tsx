"use client";

import { useRef } from "react";
import { deleteAsset, putAsset } from "@/lib/idb";
import { createId } from "@/lib/id";
import { useStore } from "@/lib/store";
import { Field, TextField, Toggle, ghostButtonClass } from "@/components/ui/controls";
import type { BackgroundKind } from "@/lib/types";

const KINDS: Array<{ id: BackgroundKind; label: string }> = [
  { id: "image", label: "Image" },
  { id: "gradient", label: "Gradient" },
  { id: "color", label: "Color" },
];

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl border border-white/10 bg-black/25 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`focus-ring flex-1 rounded-lg px-3 py-1.5 text-sm transition ${
            value === option.id
              ? "bg-accent font-bold text-black"
              : "text-fg-dim hover:text-fg"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={`${label} — ${value}${suffix}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="focus-ring w-full accent-[var(--color-accent)]"
        aria-label={label}
      />
    </Field>
  );
}

export function AppearanceTab() {
  const background = useStore((s) => s.background);
  const setBackground = useStore((s) => s.setBackground);
  const clock = useStore((s) => s.clock);
  const setClock = useStore((s) => s.setClock);
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = async (file: File) => {
    const key = createId("bg");
    await putAsset(key, file);
    const previous = background.idbKey;
    setBackground({ kind: "image", imageSource: "upload", idbKey: key });
    if (previous) void deleteAsset(previous);
  };

  return (
    <div className="space-y-5">
      <Field label="Background">
        <Segmented
          value={background.kind}
          options={KINDS}
          onChange={(kind) => setBackground({ kind })}
        />
      </Field>

      {background.kind === "image" ? (
        <div className="space-y-3">
          <Segmented
            value={background.imageSource}
            options={[
              { id: "upload" as const, label: "Upload" },
              { id: "url" as const, label: "URL" },
            ]}
            onChange={(imageSource) => setBackground({ imageSource })}
          />

          {background.imageSource === "upload" ? (
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onUpload(file);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={ghostButtonClass}
              >
                Choose image…
              </button>
              <span className="text-xs text-fg-faint">
                {background.idbKey ? "Image stored locally" : "No image yet"}
              </span>
            </div>
          ) : (
            <TextField
              label="Image URL"
              placeholder="https://…"
              value={background.url}
              onChange={(event) => setBackground({ url: event.target.value })}
            />
          )}
        </div>
      ) : null}

      {background.kind === "color" ? (
        <Field label="Color">
          <input
            type="color"
            value={background.color}
            onChange={(event) => setBackground({ color: event.target.value })}
            aria-label="Background color"
            className="focus-ring h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-black/25 p-1"
          />
        </Field>
      ) : null}

      {background.kind === "gradient" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="From">
              <input
                type="color"
                value={background.gradient.from}
                onChange={(event) =>
                  setBackground({
                    gradient: { ...background.gradient, from: event.target.value },
                  })
                }
                aria-label="Gradient start color"
                className="focus-ring h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-black/25 p-1"
              />
            </Field>
            <Field label="To">
              <input
                type="color"
                value={background.gradient.to}
                onChange={(event) =>
                  setBackground({
                    gradient: { ...background.gradient, to: event.target.value },
                  })
                }
                aria-label="Gradient end color"
                className="focus-ring h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-black/25 p-1"
              />
            </Field>
          </div>
          <Slider
            label="Angle"
            value={background.gradient.angle}
            min={0}
            max={360}
            step={5}
            suffix="°"
            onChange={(angle) =>
              setBackground({ gradient: { ...background.gradient, angle } })
            }
          />
        </div>
      ) : null}

      <Slider
        label="Background blur"
        value={background.blur}
        min={0}
        max={40}
        step={1}
        suffix="px"
        onChange={(blur) => setBackground({ blur })}
      />
      <Slider
        label="Dim"
        value={Math.round(background.dim * 100)}
        min={0}
        max={90}
        step={5}
        suffix="%"
        onChange={(value) => setBackground({ dim: value / 100 })}
      />

      <div className="border-t border-white/10 pt-4">
        <Toggle
          label="24-hour clock"
          checked={clock.format24}
          onChange={(format24) => setClock({ format24 })}
        />
        <Toggle
          label="Show seconds"
          checked={clock.showSeconds}
          onChange={(showSeconds) => setClock({ showSeconds })}
        />
      </div>
    </div>
  );
}
