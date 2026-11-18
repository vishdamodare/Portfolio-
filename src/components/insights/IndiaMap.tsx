import { pct } from "@/lib/format";

// Stylised outline of India (lon, lat). Coarse on purpose: it only masks a dot grid.
const OUTLINE: [number, number][] = [
  [74.5, 37], [77.8, 35.5], [79.3, 32.5], [81, 30.2], [84, 28.6], [88, 27.9], [88.2, 26.4], [89.8, 26.3], [92, 26.9],
  [95.5, 29], [97.3, 28], [96, 26.5], [95, 25], [94.2, 23.5], [93.2, 22], [92.4, 22.4], [92.2, 24.2], [90, 25.3],
  [89, 25.2], [88.6, 24], [88.9, 21.6], [87, 21.5], [86, 20], [84.8, 19.2], [82.3, 16.6], [80.3, 15.8], [80.2, 13.4],
  [79.9, 10.3], [78.2, 8.9], [77.3, 8.1], [76.5, 9.5], [75.7, 11.5], [74.6, 13.5], [73.5, 16], [72.8, 19], [72.9, 20.8],
  [72.6, 21.4], [70.9, 20.7], [69, 22.3], [68.4, 23.5], [69.5, 24.3], [71, 24.4], [70.3, 25.7], [70, 27.8], [71.9, 28],
  [72.9, 29.5], [74.2, 30.4], [74.6, 32], [73.9, 33], [74.2, 34.6], [73.8, 35.5],
];
const MUMBAI: [number, number] = [72.88, 19.08];
const STEP = 0.75;

function inside([x, y]: [number, number]) {
  let hit = false;
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i];
    const [xj, yj] = OUTLINE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const DOTS: [number, number][] = [];
for (let lon = 68; lon <= 97.5; lon += STEP) for (let lat = 8; lat <= 37; lat += STEP) if (inside([lon, lat])) DOTS.push([lon, lat]);
// All dots as one path (two arcs each) — one DOM node instead of ~600.
const R = 0.22;
const DOT_PATH = DOTS.map(([x, y]) => `M${(x - R).toFixed(2)} ${(-y).toFixed(2)}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0`).join("");

export function IndiaMap({ mumbai }: { mumbai: number }) {
  return (
    <div className="mt-4 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
      <svg viewBox="67 -38 31 31" className="mx-auto w-full max-w-[420px]" aria-hidden>
        <path d={DOT_PATH} fill="var(--color-ink)" opacity={0.28} />
        <circle className="pulse" cx={MUMBAI[0]} cy={-MUMBAI[1]} r={0.5} fill="var(--color-accent)" />
        <circle cx={MUMBAI[0]} cy={-MUMBAI[1]} r={0.5} fill="var(--color-accent)" />
      </svg>
      <div className="text-center sm:text-left">
        <p className="font-num text-6xl font-semibold text-accent">{pct(mumbai)}</p>
        <p className="mt-1 text-sm text-muted">
          of followers are in Mumbai,
          <br /> the top city.
        </p>
      </div>
    </div>
  );
}
