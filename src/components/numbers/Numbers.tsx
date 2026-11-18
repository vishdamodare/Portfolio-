"use client";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { creator } from "@/data/creator";
import { compact, format } from "@/lib/format";
import { dur, ease } from "@/lib/motion";
import { useMedia } from "@/lib/reduced-motion";
import { SplitText } from "../ui/SplitText";

const i90 = creator.insights90d;
const src90 = `Instagram insights · last 90 days (${creator.insightsPeriod})`;
const STATS = [
  { value: creator.stats.followers, label: "Followers", src: "Instagram · as of 13 Nov 2026" },
  { value: creator.stats.monthlyViews, label: "Monthly views", src: "Media kit" },
  { value: i90.reelViews, label: "Reel views", src: src90 },
  { value: i90.viewers, label: "Viewers", src: src90 },
  { value: i90.likes, label: "Likes", src: src90 },
  { value: i90.shares, label: "Shares", src: src90 },
  { value: i90.saves, label: "Saves", src: src90 },
];
const N = STATS.length;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const footnote =`Reels published in the same 90 days: ${i90.reels}.`;

/** Pinned (CSS sticky) sequence; scroll progress scrubs through the stats with count-ups. */
export function Numbers() {
  const ref = useRef<HTMLElement>(null);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const f = Math.min(p * N, N - 0.0001);
    const idx = Math.floor(f);
    const local = easeOut(Math.min((f - idx) * 1.8, 1));
    setActive(idx);
    const el = nums.current[idx];
    if (el) el.textContent = compact(STATS[idx].value * local);
  });

  if (reduce) {
    return (
      <section id="numbers" aria-labelledby="numbers-h" className="section bg-ink text-canvas">
        <div className="container-x">
          <h2 id="numbers-h" className="font-display text-5xl md:text-7xl">
            Numbers that <em>move</em>.
          </h2>
          <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-canvas/70">{s.label}</dt>
                <dd className="font-num text-6xl font-semibold">{compact(s.value)}</dd>
                <dd className="mt-1 text-xs text-canvas/60">{s.src}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-sm text-canvas/70">{footnote}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="numbers" ref={ref} aria-labelledby="numbers-h" className="relative bg-ink text-canvas" style={{ height: `${N * 60 + 100}svh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="container-x grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow !text-canvas/60">By the numbers</p>
            <SplitText as="h2" text="Numbers that *move*." className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl" />
            <p id="numbers-h" className="sr-only">
              Numbers
            </p>
            <div className="mt-6 flex items-center gap-4 font-num md:mt-10 text-lg tabular-nums">
              <span>{String(active + 1).padStart(2, "0")}</span>
              <span className="flex gap-1.5" aria-hidden>
                {STATS.map((s, i) => (
                  <span key={s.label} className={`h-px w-6 transition-colors duration-500 ${i <= active ? "bg-canvas" : "bg-canvas/25"}`} />
                ))}
              </span>
              <span className="text-canvas/50">{String(N).padStart(2, "0")}</span>
            </div>
            <a
              href={creator.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#dd2a7b]/20 transition-transform duration-200 hover:scale-[1.03]"
            >
              <InstagramIcon /> Follow {creator.handle} on Instagram <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="relative h-[28svh] md:col-span-7 md:h-[52svh]">
            {/* Full list for assistive tech; visuals below are aria-hidden. */}
            <dl className="sr-only">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>
                    {compact(s.value)} ({s.src})
                  </dd>
                </div>
              ))}
            </dl>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                aria-hidden
                className="absolute inset-0 flex flex-col justify-end"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, y: i < active ? -60 : i > active ? 60 : 0 }}
                transition={{ duration: dur.ui, ease: ease.reveal }}
              >
                <p className="text-lg text-canvas/70">{s.label}</p>
                <span
                  ref={(el) => {
                    nums.current[i] = el;
                  }}
                  className="font-num text-[clamp(5.5rem,26vw,15rem)] font-semibold leading-[0.85] tabular-nums tracking-tight"
                >
                  {format(s.value, "compact")}
                </span>
                <p className="mt-4 text-sm text-canvas/60">{s.src}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="container-x mt-10 text-xs text-canvas/60">{footnote}</p>

        {/* Pinned sections can look "stuck"; tell people there is more below. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: active < N - 1 ? 1 : 0 }}
          transition={{ duration: dur.ui }}
          className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-xs uppercase tracking-[0.24em] text-canvas/70"
        >
          <span>Keep scrolling · {N - 1 - active} more</span>
          <span className="animate-bounce text-lg leading-none">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
