import { NextResponse } from "next/server";

/**
 * Coarse IP-based location fallback for when the browser Geolocation
 * permission is denied or unavailable. Reads the edge geo headers set by the
 * hosting platform; falls back to a neutral default so the widget always
 * renders something.
 */
export async function GET(request: Request) {
  const headers = request.headers;
  const latitude =
    headers.get("x-vercel-ip-latitude") ?? headers.get("cf-iplatitude");
  const longitude =
    headers.get("x-vercel-ip-longitude") ?? headers.get("cf-iplongitude");

  if (latitude && longitude) {
    return NextResponse.json({
      latitude: Number(latitude),
      longitude: Number(longitude),
      source: "ip",
    });
  }

  return NextResponse.json({
    latitude: 47.4979,
    longitude: 19.0402,
    source: "default",
  });
}
