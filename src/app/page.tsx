import { CardGrid } from "@/components/cards/CardGrid";
import { Clock } from "@/components/clock/Clock";
import { SearchBar } from "@/components/search/SearchBar";
import { WeatherWidget } from "@/components/weather/WeatherWidget";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <WeatherWidget />
      </div>
      <Clock />
      <SearchBar />
      <CardGrid />
    </main>
  );
}
