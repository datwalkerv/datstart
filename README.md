# datstart

A personal browser start page — clock, weather, search, pinned link cards and an
app dock, in a dark liquid-glass UI with a neon green accent.

![stack](https://img.shields.io/badge/Next.js-16-black) ![stack](https://img.shields.io/badge/Tailwind-v4-black)

## Features

- **Clock** — day and time in a glass panel; 12/24-hour and optional seconds.
- **Weather** — current conditions, rain chance, today's high/low and an hourly
  temperature curve, from [Open-Meteo](https://open-meteo.com) (no API key).
  Location comes from the browser, with an IP-based fallback; the city is never
  shown.
- **Search** — Google by default, plus DuckDuckGo, Bing, Brave, Perplexity,
  YouTube or a custom `{q}` template. Typing a URL navigates straight to it.
- **Cards** — Work and Personal to start; add your own, pin sites as favicon
  buttons, drag pins between cards.
- **Dock** — bottom-centered app dock with placeholder tiles, configured in
  code (`src/lib/dock.ts`).
- **Backgrounds** — upload an image, paste a URL, or build a gradient/solid
  color, with blur and dim controls.
- **Your data stays local** — everything is in `localStorage` (uploaded images in
  IndexedDB). Export and import a JSON backup from Settings → Data.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · zustand ·
dnd-kit · Inter + Instrument Serif.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Customizing the dock

Edit `DOCK_ITEMS` in `src/lib/dock.ts`. Each tile is a plain
`{ id, label, url, iconUrl }` entry and `iconUrl` takes any image URL — an SVG,
a PNG or a data URI. The `monogramIcon()` helper renders the placeholder shape:
a rounded `#39FF14` square with a black monogram.
