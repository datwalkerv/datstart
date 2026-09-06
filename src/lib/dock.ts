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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="22" fill="#39FF14"/><text x="50" y="67" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="38" letter-spacing="-2" fill="#080808">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DOCK_ITEMS: DockItem[] = [
  {
    id: "datclean",
    label: "datclean",
    url: "https://datclean.vercel.app/",
    iconUrl:
      monogramIcon("dc"),
  },
  { id: "datmotions", label: "datmotions", url: "https://datmotions.vercel.app/", iconUrl: monogramIcon("dm") },
  { id: "datnotes", label: "datnotes", url: "https://datnotes.vercel.app/", iconUrl: monogramIcon("dn") },
  { id: "datsounds", label: "datsounds", url: "https://datsounds.vercel.app/", iconUrl: monogramIcon("ds") },
];
