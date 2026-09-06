/** Canonical site metadata, drawn from the README. */
export const SITE = {
  name: "datstart",
  tagline: "Every tab starts here.",
  description:
    "A simple yet effective premium start page that lives entirely in your browser. Liquid glass clock, ambient weather, any search engine, pinned cards and an app dock — no accounts, no sync, no servers.",
  shortDescription:
    "A premium liquid-glass start page that lives entirely in your browser.",
  /** Override with NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://datstart.vercel.app",
  author: "datwalkerv",
  repository: "https://github.com/datwalkerv/datstart",
  accent: "#39FF14",
  background: "#08080a",
} as const;

export const SITE_KEYWORDS = [
  "start page",
  "new tab page",
  "homepage",
  "browser start page",
  "custom new tab",
  "bookmark dashboard",
  "pinned bookmarks",
  "liquid glass",
  "clock",
  "weather widget",
  "search bar",
  "app dock",
  "local first",
  "privacy friendly",
  "no tracking",
  "open source",
];
