import type { DockItem } from "./types";

/**
 * The dock. Edit `DOCK_ITEMS` below to add your apps:
 *
 *   url      where the tile links to — an absolute URL for another site, or a
 *            path like "/notes" for a route inside this app
 *   iconUrl  the tile's image — an SVG or PNG URL, or a data URI
 *   label    the tooltip text
 *
 * `monogramIcon` renders the placeholder shape: the datmotions favicon, a
 * rounded #39FF14 square with a black monogram.
 */
export function monogramIcon(text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#39FF14"/><text x="16" y="16.5" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="14" fill="black">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DOCK_ITEMS: DockItem[] = [
  {
    id: "datmotions",
    label: "datmotions",
    url: "https://datmotions.vercel.app/",
    iconUrl:
      "https://raw.githubusercontent.com/datwalkerv/datmotions/refs/heads/main/apps/web/public/favicon.svg",
  },
  { id: "app-2", label: "App 2", url: "", iconUrl: monogramIcon("a2") },
  { id: "app-3", label: "App 3", url: "", iconUrl: monogramIcon("a3") },
  { id: "app-4", label: "App 4", url: "", iconUrl: monogramIcon("a4") },
  { id: "app-5", label: "App 5", url: "", iconUrl: monogramIcon("a5") },
  { id: "app-6", label: "App 6", url: "", iconUrl: monogramIcon("a6") },
];
