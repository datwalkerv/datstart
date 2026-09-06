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

/** Where the coordinates came from: the device, or a coarse fallback. */
export type LocationSource = "device" | "fallback";

type Located = Coords & { source: LocationSource; label: string };

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
const REFRESH_MS = 15 * 60 * 1000;

function getDevicePosition(): Promise<Coords | null> {
  return new Promise((resolve) => {
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
}

/** True when the browser has already granted geolocation, so no prompt shows. */
async function hasGeolocationPermission(): Promise<boolean> {
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state === "granted";
  } catch {
    return false;
  }
}

async function fetchFallbackLocation(): Promise<Located> {
  const response = await fetch("/api/geo");
  if (!response.ok) throw new Error("Could not resolve location");
  const data = (await response.json()) as Coords & { label: string };
  return { ...data, source: "fallback" };
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
    data.hourly.time.findIndex(
      (t) => t.slice(0, 13) === data.current.time.slice(0, 13),
    ),
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

export function useWeather() {
  const unit = useStore((s) => s.weather.unit);
  const savedCoords = useStore((s) => s.weather.coords);
  const setCoords = useStore((s) => s.setCoords);

  const [located, setLocated] = useState<Located | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Saved coordinates only ever come from the device, so they are trusted.
   * Otherwise geolocation is used only when already permitted — asking is left
   * to the "Enable location" button so the page never prompts on load.
   */
  const resolveLocation = useCallback(async (): Promise<Located> => {
    if (savedCoords) return { ...savedCoords, source: "device", label: "" };
    if (await hasGeolocationPermission()) {
      const coords = await getDevicePosition();
      if (coords) {
        setCoords(coords);
        return { ...coords, source: "device", label: "" };
      }
    }
    return fetchFallbackLocation();
  }, [savedCoords, setCoords]);

  // Resolve the location once, then keep the forecast fresh for it.
  useEffect(() => {
    if (located) return;
    let cancelled = false;
    void resolveLocation()
      .then((location) => {
        if (!cancelled) setLocated(location);
      })
      .catch(() => {
        if (!cancelled) setError("Weather unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, [located, resolveLocation]);

  useEffect(() => {
    if (!located) return;
    let cancelled = false;

    const run = () =>
      fetchWeather(located, unit)
        .then((next) => {
          if (cancelled) return;
          setWeather(next);
          setError(null);
        })
        .catch(() => {
          if (!cancelled) setError("Weather unavailable");
        });

    void run();
    const interval = window.setInterval(() => void run(), REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [located, unit]);

  /** Prompts for geolocation and switches to the device's own coordinates. */
  const enableLocation = useCallback(async () => {
    const coords = await getDevicePosition();
    if (!coords) return;
    setCoords(coords);
    setLocated({ ...coords, source: "device", label: "" });
  }, [setCoords]);

  return { weather, error, location: located, enableLocation };
}
