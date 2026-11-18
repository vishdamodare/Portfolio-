"use client";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { useEffect, useRef } from "react";
import { creator } from "@/data/creator";
import { useMedia } from "@/lib/reduced-motion";
import { Sparkle } from "../ui/Sparkle";

const BASE = 2.5; // % of one copy per second

/** Infinite services marquee. Scroll velocity speeds it up and flips direction. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const live = useRef(false);
  useEffect(() => {
    live.current = inView && !reduce;
  }, [inView, reduce]);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [0, 1000], [0, 4], { clamp: false });
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!live.current) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let move = dir.current * BASE * (delta / 1000);
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const row = (
    <div className="flex shrink-0 items-center">
      {creator.services.map((s) => (
        <span key={s.name} className="flex items-center gap-8 pr-8 font-display text-4xl md:text-6xl">
          {s.name}
          <Sparkle className="size-5 text-accent md:size-6" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} aria-hidden className="overflow-hidden border-y border-line py-6 md:py-8">
      <motion.div style={{ x }} className="flex w-max">
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
