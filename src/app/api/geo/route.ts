import { NextResponse } from "next/server";

const FALLBACK = { latitude: 47.4979, longitude: 19.0402, label: "Budapest" };

/**
 * Coarse IP-based location for when the browser Geolocation permission has not
 * been granted. Reads the edge geo headers set by the hosting platform and
 * falls back to a fixed location so the widget always shows something.
 */
export async function GET(request: Request) {
  const headers = request.headers;
  const latitude =
    headers.get("x-vercel-ip-latitude") ?? headers.get("cf-iplatitude");
  const longitude =
    headers.get("x-vercel-ip-longitude") ?? headers.get("cf-iplongitude");
  const city = headers.get("x-vercel-ip-city") ?? headers.get("cf-ipcity");

  if (latitude && longitude) {
    return NextResponse.json({
      latitude: Number(latitude),
      longitude: Number(longitude),
      label: city ? decodeURIComponent(city) : "your region",
      source: "ip",
    });
  }

  return NextResponse.json({ ...FALLBACK, source: "default" });
}
