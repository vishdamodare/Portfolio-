"use client";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { format, type FormatKey } from "@/lib/format";
import { dur, ease } from "@/lib/motion";

/** Counts from 0 to `value` when scrolled into view. Server HTML holds the final value. */
export function CountUp({ value, fmt, className = "" }: { value: number; fmt: FormatKey; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = format(0, fmt);
      return;
    }
    const c = animate(0, value, { duration: dur.hero, ease: ease.reveal, onUpdate: (v) => (el.textContent = format(v, fmt)) });
    return () => c.stop();
  }, [inView, reduce, value, fmt]);

  return (
    <span className={`tabular-nums ${className}`}>
      <span ref={ref} aria-hidden>
        {format(value, fmt)}
      </span>
      <span className="sr-only">{format(value, fmt)}</span>
    </span>
  );
}
