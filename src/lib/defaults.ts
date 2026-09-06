import type { AppState } from "./types";

export const STORAGE_KEY = "datstart:v1";
export const STATE_VERSION = 1;

export const GITHUB_URL = "https://github.com/datwalkerv/datstart";

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
    weather: { unit: "c", coords: null },
    clock: { format24: true, showSeconds: false },
  };
}
