import { ImageResponse } from "next/og";
import { creator } from "@/data/creator";
import { compact } from "@/lib/format";

export const alt = `${creator.name} — ${creator.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f4f1ea", color: "#111111" }}>
        <div style={{ display: "flex", fontSize: 28, color: "#b3122e" }}>
          {creator.role} · {creator.location}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, lineHeight: 0.9, letterSpacing: -4 }}>
          <span>Abhishek</span>
          <span style={{ color: "#b3122e", fontStyle: "italic" }}>Soni</span>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 32 }}>
          <span>{compact(creator.stats.followers)} followers</span>
          <span>{compact(creator.stats.monthlyViews)} monthly views</span>
          <span>{creator.handle}</span>
        </div>
      </div>
    ),
    size,
  );
}
