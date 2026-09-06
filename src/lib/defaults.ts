import type { AppState, DockItem } from "./types";

export const STORAGE_KEY = "datstart:v1";
export const STATE_VERSION = 1;

export const GITHUB_URL = "https://github.com/datwalkerv/datstart";

/**
 * Placeholder dock icon in the datmotions favicon style:
 * a rounded neon square with a black monogram. Swap these out for real logos.
 */
export function monogramIcon(text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#39FF14"/><text x="16" y="16.5" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="14" fill="black">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const dockPlaceholders: Array<[string, string]> = [
  ["dm", "datmotions"],
  ["ds", "datstart"],
  ["ap", "App 3"],
  ["ap", "App 4"],
  ["ap", "App 5"],
  ["ap", "App 6"],
];

export const defaultDock: DockItem[] = dockPlaceholders.map(
  ([mono, label], i) => ({
    id: `dock_default_${i + 1}`,
    label,
    url: "",
    iconUrl: monogramIcon(mono),
  }),
);

export function createDefaultState(): AppState {
  return {
    version: STATE_VERSION,
    search: {
      engineId: "google",
      customTemplate: "https://example.com/search?q={q}",
      openInNewTab: false,
    },
    background: {
      kind: "gradient",
      imageSource: "url",
      url: "",
      idbKey: null,
      color: "#08080a",
      gradient: { from: "#0b1a0d", to: "#08080a", angle: 160 },
      blur: 0,
      dim: 0.35,
    },
    cards: [
      { id: "card_work", title: "Work", pins: [] },
      { id: "card_personal", title: "Personal", pins: [] },
    ],
    dock: defaultDock,
    weather: { unit: "c", coords: null },
    clock: { format24: true, showSeconds: false },
  };
}
