import type { DockItem } from "./types";

/**
 * Dock apps. Edit this list to add your own — `iconUrl` takes any image URL
 * (SVG, PNG or a data URI).
 *
 * The placeholders use `monogramIcon`, which renders the datmotions favicon
 * shape: a rounded #39FF14 square with a black monogram.
 */
export function monogramIcon(text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#39FF14"/><text x="16" y="16.5" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="14" fill="black">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DOCK_ITEMS: DockItem[] = [
  {
    id: "datmotions",
    label: "datmotions",
    url: "",
    iconUrl:
      "https://raw.githubusercontent.com/datwalkerv/datmotions/refs/heads/main/apps/web/public/favicon.svg",
  },
  { id: "app-2", label: "App 2", url: "", iconUrl: monogramIcon("a2") },
  { id: "app-3", label: "App 3", url: "", iconUrl: monogramIcon("a3") },
  { id: "app-4", label: "App 4", url: "", iconUrl: monogramIcon("a4") },
  { id: "app-5", label: "App 5", url: "", iconUrl: monogramIcon("a5") },
  { id: "app-6", label: "App 6", url: "", iconUrl: monogramIcon("a6") },
];
