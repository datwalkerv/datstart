"use client";

import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { TempChart } from "./TempChart";
import { WeatherIcon, describeWeather } from "./wmo";
import { useWeather } from "./useWeather";

const round = (n: number) => Math.round(n);

function Droplet() {
  return (
    <svg viewBox="0 0 12 14" className="size-3" aria-hidden="true">
      <path
        d="M6 .8c3 3.7 4.6 6 4.6 8A4.6 4.6 0 0 1 1.4 8.8c0-2 1.6-4.3 4.6-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WeatherWidget() {
  const hydrated = useHydrated();
  const unit = useStore((s) => s.weather.unit);
  const setWeatherSettings = useStore((s) => s.setWeather);
  const { weather, error } = useWeather();

  if (!hydrated) return null;

  return (
    <div className="glass rounded-3xl px-4 py-3 min-w-[13.5rem] text-left">
      {weather ? (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <WeatherIcon
                code={weather.weatherCode}
                isDay={weather.isDay}
                className="size-7 text-fg"
              />
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setWeatherSettings({ unit: unit === "c" ? "f" : "c" })
                  }
                  title="Toggle units"
                  className="focus-ring text-logo text-2xl leading-none tabular-nums"
                >
                  {round(weather.temperature)}°
                </button>
                <p className="mt-0.5 text-[0.7rem] text-fg-dim">
                  {describeWeather(weather.weatherCode, weather.isDay).label}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-accent">
              <Droplet />
              {round(weather.rainChance)}%
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-2.5">
            <span className="w-8 text-right text-xs font-semibold tabular-nums text-fg-dim">
              {round(weather.low)}°
            </span>
            <TempChart
              values={weather.hourly}
              currentIndex={weather.currentHour}
            />
            <span className="w-8 text-xs font-semibold tabular-nums text-fg">
              {round(weather.high)}°
            </span>
          </div>
        </>
      ) : (
        <p className="py-3 text-xs text-fg-dim">{error ?? "Loading weather…"}</p>
      )}
    </div>
  );
}
