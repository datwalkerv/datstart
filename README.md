<div align="center">

<img src="./public/favicon.svg" width="10%" alt="datstart" style="border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);" />

# datstart

**Every tab starts here.**

A simple yet effective premium start page that lives entirely in your browser.

</div>

## ✨ Key Features

- **🕐 Liquid Glass Clock**: The time is rendered as frosted glass lettering — three stacked layers give the numerals a refracted body, a top-to-bottom sheen and a lit rim, so your wallpaper shows straight through them.
- **🌦️ Ambient Weather**: Current conditions, rain chance, today's high and low, and an hourly temperature curve — all in one glass card in the corner. No city name, no clutter, just the numbers.
- **📍 Location On Your Terms**: The page never prompts on load. Until you grant location it quietly falls back to a coarse one and says so, with a single tap to switch to yours.
- **🔍 Any Search Engine**: Google by default, plus DuckDuckGo, Bing, Brave, Perplexity and YouTube, or your own `{q}` template. Type a URL instead of a query and it navigates straight there.
- **🗂️ Pinned Cards**: Group your sites into cards — Work and Personal to start, as many as you like after that. Pins are favicon buttons; naming one is optional, so a card can be pure icons.
- **✋ Drag Anything**: Reorder pins inside a card, drag them between cards, and reorder the cards themselves.
- **🚀 App Dock**: A bottom-center dock of my own free and open-source apps.
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
- **Weather**: [Open-Meteo](https://open-meteo.com/)
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) and [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)

## ⚖️ Privacy & Security

- datstart has **no database, no accounts, and no authentication**. Your cards, pins and settings never leave your browser.

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
