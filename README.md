<div align="center">

<img src="./public/favicon.svg" width="10%" alt="datstart" style="border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);" />

# datstart

**Every tab starts here.**

A liquid-glass start page that lives entirely in your browser.

</div>

## ✨ Key Features

- **🕐 Liquid Glass Clock**: The time is rendered as frosted glass lettering — three stacked layers give the numerals a refracted body, a top-to-bottom sheen and a lit rim, so your wallpaper shows straight through them.
- **🌦️ Ambient Weather**: Current conditions, rain chance, today's high and low, and an hourly temperature curve — all in one glass card in the corner. No city name, no clutter, just the numbers.
- **📍 Location On Your Terms**: The page never prompts on load. Until you grant location it quietly falls back to a coarse one and says so, with a single tap to switch to yours.
- **🔍 Any Search Engine**: Google by default, plus DuckDuckGo, Bing, Brave, Perplexity and YouTube — or your own `{q}` template. Type a URL instead of a query and it navigates straight there.
- **🗂️ Pinned Cards**: Group your sites into cards — Work and Personal to start, as many as you like after that. Pins are favicon buttons; naming one is optional, so a card can be pure icons.
- **✋ Drag Anything**: Reorder pins inside a card, drag them between cards, and reorder the cards themselves.
- **🚀 App Dock**: A bottom-center dock for your own apps, configured in code so it's version-controlled rather than hidden in browser storage.
- **🖼️ Your Background**: Upload an image, paste a URL, or build a gradient or solid color — then dial in blur and dim until the glass sits right on top of it.
- **💾 localStorage Persistence**: Cards, pins and settings save to your browser's local storage; uploaded wallpapers go to IndexedDB. No accounts, no sync, no servers.
- **📦 Portable**: Export everything to a JSON file and import it back — on another browser, another machine, whenever.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime & View Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS-level custom theme variables
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **State**: [Zustand](https://zustand.docs.pmnd.rs/) with `persist`
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **Weather**: [Open-Meteo](https://open-meteo.com/) — free, no API key
- **Icons**: hand-drawn inline SVG — no icon library
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) and [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)

## 🚀 Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
```

Then set it as your browser's new-tab or homepage.

### Adding your apps to the dock

Edit `DOCK_ITEMS` in [`src/lib/dock.ts`](./src/lib/dock.ts):

```ts
{
  id: "datnotes",
  label: "datnotes",                    // tooltip
  url: "https://datnotes.vercel.app/",  // or "/notes" for a route in this app
  iconUrl: "https://…/favicon.svg",     // SVG, PNG or a data URI
}
```

Absolute URLs render as a plain `<a>`, paths starting with `/` render as a `next/link`. The `monogramIcon()` helper draws the placeholder shape: a rounded `#39FF14` square with a black monogram.

## 🎨 Design

Dark neutral surfaces, a neon green `#39FF14` accent used sparingly, and backdrop blur on every surface — because you choose the wallpaper underneath, so nothing is allowed to be opaque. Inter carries the interface, with black weights for the numerals and logos; Instrument Serif handles card titles and headings. Everything sits on the center line, with only the weather and the settings gear anchored to corners.

## ⚖️ Privacy & Security

### Essentially Client-Side

- datstart has **no database, no accounts, and no authentication**. Your cards, pins and settings never leave your browser.
- The one server route, `/api/geo`, returns a coarse location from your hosting platform's edge headers when you haven't granted geolocation. It reads nothing else and stores nothing.

### The Two Outbound Requests

datstart is honest about the only data that ever leaves your browser:

- **Weather**: your coordinates go to [Open-Meteo](https://open-meteo.com/) to fetch the forecast. Nothing else is sent, and no key identifies you.
- **Favicons**: the domain of each pinned site goes to Google's public favicon service to fetch its icon. Set a custom `iconUrl` on a pin to skip that request entirely.

Everything else — including your uploaded wallpaper — stays on your device.

### Location

- The page **never prompts for location on load**. Geolocation is used only if you have already granted it, or when you press **Enable location** yourself.
- Coordinates are only saved locally once they come from your device; the coarse fallback is never persisted.
- The city is never displayed, only the weather.

### Privacy Policy

- datstart collects **absolutely nothing** about you. No analytics, no telemetry, no cookies, no tracking of any kind.
- The only data stored is what you put in yourself, kept in your browser's `localStorage` and `IndexedDB`:
  - Your cards and their pinned sites
  - Search engine choice, clock and background preferences
  - Your uploaded background image
  - Your coordinates, if you enabled location

<br>

**Made with love for love. 💚**  
*Every tab starts here.*
