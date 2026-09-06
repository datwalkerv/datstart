import type { InputHTMLAttributes, ReactNode } from "react";

export const inputClass =
  "focus-ring w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-fg placeholder:text-fg-faint";

export const primaryButtonClass =
  "focus-ring rounded-xl bg-accent px-4 py-2 text-sm font-bold text-black transition hover:brightness-110";

export const ghostButtonClass =
  "focus-ring rounded-xl border border-white/10 px-4 py-2 text-sm text-fg-dim transition hover:bg-white/10 hover:text-fg";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg-dim">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-fg-faint">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} hint={hint}>
      <input {...props} className={inputClass} />
    </Field>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="focus-ring flex w-full items-center justify-between gap-4 py-1.5 text-sm text-fg"
    >
      {label}
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-accent" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
