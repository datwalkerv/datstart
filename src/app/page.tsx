import { BackgroundLayer } from "@/components/background/BackgroundLayer";
import { CardGrid } from "@/components/cards/CardGrid";
import { Clock } from "@/components/clock/Clock";
import { Dock } from "@/components/dock/Dock";
import { SearchBar } from "@/components/search/SearchBar";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { StructuredData } from "@/components/seo/StructuredData";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <>
      <StructuredData />
      <BackgroundLayer />

      <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 px-4 pb-32 pt-24 sm:gap-8">
        {/* The visible page is a dashboard of widgets, so the heading and
            summary that describe it to crawlers live here, off-screen. */}
        <h1 className="sr-only">
          {SITE.name} — {SITE.tagline}
        </h1>
        <p className="sr-only">{SITE.description}</p>

        <div className="absolute right-3 top-3 origin-top-right scale-90 sm:right-6 sm:top-6 sm:scale-100">
          <WeatherWidget />
        </div>

        <div className="animate-rise">
          <Clock />
        </div>

        <div
          className="animate-rise relative z-30 flex w-full justify-center"
          style={{ animationDelay: "60ms" }}
        >
          <SearchBar />
        </div>

        <div
          className="animate-rise relative z-10 flex w-full justify-center"
          style={{ animationDelay: "120ms" }}
        >
          <CardGrid />
        </div>

        <Dock />
        <SettingsButton />
      </main>
    </>
  );
}
