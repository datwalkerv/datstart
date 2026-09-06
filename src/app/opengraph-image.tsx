import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The social card: the app's own palette, glass panel and neon monogram. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: SITE.background,
          backgroundImage: `radial-gradient(circle at 50% 8%, rgba(57,255,20,0.22), transparent 55%), linear-gradient(160deg, #0b1a0d, ${SITE.background})`,
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 116,
            height: 116,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            backgroundColor: SITE.accent,
            color: "#000",
            fontSize: 54,
            fontWeight: 700,
            boxShadow: "0 30px 80px rgba(57,255,20,0.35)",
          }}
        >
          ds
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: "-0.045em",
          }}
        >
          {SITE.name}
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 40,
            color: SITE.accent,
            letterSpacing: "-0.02em",
          }}
        >
          {SITE.tagline}
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            padding: "18px 34px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "#a1a1aa",
            fontSize: 28,
          }}
        >
          Clock · Weather · Search · Pins · Dock
        </div>
      </div>
    ),
    size,
  );
}
