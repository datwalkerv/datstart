"use client";

import { useId } from "react";

type Props = {
  /** Today's hourly temperatures, in display units. */
  values: number[];
  /** Index of the current hour, highlighted with a dot. */
  currentIndex: number;
  width?: number;
  height?: number;
};

function smoothPath(points: Array<[number, number]>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0][0]} ${points[0][1]}`;

  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  return d;
}

export function TempChart({
  values,
  currentIndex,
  width = 108,
  height = 34,
}: Props) {
  const gradientId = useId();
  if (values.length < 2) return <div style={{ width, height }} />;

  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const points = values.map<[number, number]>((value, i) => [
    (i / (values.length - 1)) * width,
    height - pad - ((value - min) / span) * (height - pad * 2),
  ]);

  const line = smoothPath(points);
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const dot = points[Math.min(Math.max(currentIndex, 0), points.length - 1)];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx={dot[0]} cy={dot[1]} r="3" fill="var(--color-accent)" />
      <circle cx={dot[0]} cy={dot[1]} r="6" fill="var(--color-accent)" opacity="0.25" />
    </svg>
  );
}
