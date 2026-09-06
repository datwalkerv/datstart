import type { JSX, SVGProps } from "react";

type IconKind =
  | "sun"
  | "moon"
  | "cloud-sun"
  | "cloud-moon"
  | "cloud"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder";

/** Maps a WMO weather code to an icon kind and a short label. */
export function describeWeather(
  code: number,
  isDay: boolean,
): { kind: IconKind; label: string } {
  if (code === 0) return { kind: isDay ? "sun" : "moon", label: "Clear" };
  if (code === 1 || code === 2)
    return {
      kind: isDay ? "cloud-sun" : "cloud-moon",
      label: code === 1 ? "Mostly clear" : "Partly cloudy",
    };
  if (code === 3) return { kind: "cloud", label: "Overcast" };
  if (code === 45 || code === 48) return { kind: "fog", label: "Fog" };
  if (code >= 51 && code <= 57) return { kind: "drizzle", label: "Drizzle" };
  if (code >= 61 && code <= 67) return { kind: "rain", label: "Rain" };
  if (code >= 71 && code <= 77) return { kind: "snow", label: "Snow" };
  if (code >= 80 && code <= 82) return { kind: "rain", label: "Showers" };
  if (code === 85 || code === 86) return { kind: "snow", label: "Snow showers" };
  if (code >= 95) return { kind: "thunder", label: "Thunderstorm" };
  return { kind: "cloud", label: "Cloudy" };
}

const cloud = (
  <path
    d="M7.5 18h9.25a3.75 3.75 0 0 0 .35-7.48 5.5 5.5 0 0 0-10.5-.9A4.3 4.3 0 0 0 7.5 18Z"
    fill="currentColor"
    fillOpacity="0.9"
  />
);

const drop = (x: number, y: number) => (
  <path
    key={`${x}-${y}`}
    d={`M${x} ${y}c.9 1.1 1.4 1.8 1.4 2.4a1.4 1.4 0 0 1-2.8 0c0-.6.5-1.3 1.4-2.4Z`}
    fill="currentColor"
  />
);

const shapes: Record<IconKind, JSX.Element> = {
  sun: (
    <g fill="currentColor">
      <circle cx="12" cy="12" r="4.4" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={12 + Math.cos(a) * 7}
              y1={12 + Math.sin(a) * 7}
              x2={12 + Math.cos(a) * 9.2}
              y2={12 + Math.sin(a) * 9.2}
            />
          );
        })}
      </g>
    </g>
  ),
  moon: (
    <path
      d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.6 8.6 0 1 0 10.4 10.4Z"
      fill="currentColor"
    />
  ),
  "cloud-sun": (
    <g>
      <circle cx="9" cy="8" r="3.2" fill="currentColor" fillOpacity="0.55" />
      {cloud}
    </g>
  ),
  "cloud-moon": (
    <g>
      <path
        d="M13.6 8.3A4.6 4.6 0 0 1 8.4 3.6a4.7 4.7 0 1 0 5.2 4.7Z"
        fill="currentColor"
        fillOpacity="0.55"
      />
      {cloud}
    </g>
  ),
  cloud: <g>{cloud}</g>,
  fog: (
    <g>
      {cloud}
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <line x1="5.5" y1="20.5" x2="15" y2="20.5" />
        <line x1="9" y1="22.8" x2="18.5" y2="22.8" />
      </g>
    </g>
  ),
  drizzle: (
    <g>
      {cloud}
      {[drop(9, 19.6), drop(14, 19.6)]}
    </g>
  ),
  rain: (
    <g>
      {cloud}
      {[drop(8, 19.4), drop(12, 20.4), drop(16, 19.4)]}
    </g>
  ),
  snow: (
    <g>
      {cloud}
      <g fill="currentColor">
        <circle cx="8.5" cy="20.6" r="1.15" />
        <circle cx="12.5" cy="21.6" r="1.15" />
        <circle cx="16.5" cy="20.6" r="1.15" />
      </g>
    </g>
  ),
  thunder: (
    <g>
      {cloud}
      <path d="M13.4 19h3l-4.6 5 1.1-3.4h-2.6l3.4-4.2-.3 2.6Z" fill="currentColor" />
    </g>
  ),
};

export function WeatherIcon({
  code,
  isDay,
  ...props
}: { code: number; isDay: boolean } & SVGProps<SVGSVGElement>) {
  const { kind, label } = describeWeather(code, isDay);
  return (
    <svg viewBox="0 0 24 26" role="img" aria-label={label} {...props}>
      {shapes[kind]}
    </svg>
  );
}
