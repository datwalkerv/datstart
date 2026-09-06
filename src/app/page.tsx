import { BackgroundLayer } from "@/components/background/BackgroundLayer";
import { CardGrid } from "@/components/cards/CardGrid";
import { Clock } from "@/components/clock/Clock";
import { Dock } from "@/components/dock/Dock";
import { RepoLink } from "@/components/footer/RepoLink";
import { SearchBar } from "@/components/search/SearchBar";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { WeatherWidget } from "@/components/weather/WeatherWidget";

export default function Home() {
  return (
    <>
      <BackgroundLayer />

      <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 px-4 pb-32 pt-24 sm:gap-8">
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          <SettingsButton />
        </div>

        <div className="absolute right-3 top-3 origin-top-right scale-90 sm:right-6 sm:top-6 sm:scale-100">
          <WeatherWidget />
        </div>

        <div className="animate-rise">
          <Clock />
        </div>

        <div
          className="animate-rise flex w-full justify-center"
          style={{ animationDelay: "60ms" }}
        >
          <SearchBar />
        </div>

        <div
          className="animate-rise flex w-full justify-center"
          style={{ animationDelay: "120ms" }}
        >
          <CardGrid />
        </div>

        <RepoLink />
        <Dock />
      </main>
    </>
  );
}
