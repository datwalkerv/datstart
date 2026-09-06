export type Pin = {
  id: string;
  title: string;
  url: string;
  /** Optional custom icon. When empty, a favicon is resolved from the URL. */
  iconUrl?: string;
};

export type Card = {
  id: string;
  title: string;
  pins: Pin[];
};

/** Dock apps are configured in code, in src/lib/dock.ts. */
export type DockItem = {
  id: string;
  label: string;
  url: string;
  iconUrl: string;
};

export type SearchEngineId =
  | "google"
  | "duckduckgo"
  | "bing"
  | "brave"
  | "perplexity"
  | "youtube"
  | "custom";

export type SearchSettings = {
  engineId: SearchEngineId;
  /** Used when engineId is "custom". Must contain a {q} placeholder. */
  customTemplate: string;
  openInNewTab: boolean;
};

export type BackgroundKind = "image" | "color" | "gradient";
export type ImageSource = "upload" | "url";

export type BackgroundSettings = {
  kind: BackgroundKind;
  imageSource: ImageSource;
  /** Remote image URL, used when imageSource is "url". */
  url: string;
  /** IndexedDB key for an uploaded image, used when imageSource is "upload". */
  idbKey: string | null;
  color: string;
  gradient: { from: string; to: string; angle: number };
  /** Blur applied to the background layer, in px. */
  blur: number;
  /** Darkening overlay opacity, 0-1. */
  dim: number;
};

export type Coords = { latitude: number; longitude: number };

export type WeatherSettings = {
  unit: "c" | "f";
  coords: Coords | null;
};

export type ClockSettings = {
  format24: boolean;
  showSeconds: boolean;
};

export type AppState = {
  version: number;
  search: SearchSettings;
  background: BackgroundSettings;
  cards: Card[];
  weather: WeatherSettings;
  clock: ClockSettings;
};
