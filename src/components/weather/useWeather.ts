"use client";

import { useCallback, useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { Coords } from "@/lib/types";

export type Weather = {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  rainChance: number;
  high: number;
  low: number;
  hourly: number[];
  currentHour: number;
};

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: (number | null)[];
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
};

const ENDPOINT = "https://api.open-meteo.com/v1/forecast";

async function resolveCoords(): Promise<Coords> {
  const fromBrowser = await new Promise<Coords | null>((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 30 * 60 * 1000 },
    );
  });

  if (fromBrowser) return fromBrowser;

  const response = await fetch("/api/geo");
  if (!response.ok) throw new Error("Could not resolve location");
  const data = (await response.json()) as Coords;
  return { latitude: data.latitude, longitude: data.longitude };
}

async function fetchWeather(coords: Coords, unit: "c" | "f"): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    current: "temperature_2m,weather_code,is_day",
    hourly: "temperature_2m,precipitation_probability",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
    forecast_days: "1",
    timezone: "auto",
    temperature_unit: unit === "f" ? "fahrenheit" : "celsius",
  });

  const response = await fetch(`${ENDPOINT}?${params.toString()}`);
  if (!response.ok) throw new Error("Weather request failed");
  const data = (await response.json()) as OpenMeteoResponse;

  const currentHour = Math.max(
    0,
    data.hourly.time.findIndex((t) => t.slice(0, 13) === data.current.time.slice(0, 13)),
  );

  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    rainChance:
      data.hourly.precipitation_probability[currentHour] ??
      data.daily.precipitation_probability_max[0] ??
      0,
    high: data.daily.temperature_2m_max[0],
    low: data.daily.temperature_2m_min[0],
    hourly: data.hourly.temperature_2m,
    currentHour,
  };
}

const REFRESH_MS = 15 * 60 * 1000;

export function useWeather() {
  const unit = useStore((s) => s.weather.unit);
  const cachedCoords = useStore((s) => s.weather.coords);
  const setCoords = useStore((s) => s.setCoords);

  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const coords = cachedCoords ?? (await resolveCoords());
      if (!cachedCoords) setCoords(coords);
      setWeather(await fetchWeather(coords, unit));
      setError(null);
    } catch {
      setError("Weather unavailable");
    }
  }, [cachedCoords, setCoords, unit]);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) void load();
    };
    run();
    const interval = window.setInterval(run, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [load]);

  return { weather, error };
}
