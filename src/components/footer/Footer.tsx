"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { creator } from "@/data/creator";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // Fill rises from the bottom: outer moves up, inner counter-moves (transform-only mask).
  const outer = useTransform(scrollYProgress, [0.2, 1], ["100%", "0%"]);
  const inner = useTransform(scrollYProgress, [0.2, 1], ["-100%", "0%"]);
  const word = creator.name.split(" ")[0].toUpperCase();
  const type = "block whitespace-nowrap font-display text-[clamp(4rem,18.5vw,19rem)] leading-[0.8] tracking-tight";

  return (
    <footer ref={ref} className="overflow-hidden border-t border-line pt-12">
      <div className="container-x flex flex-col gap-6 text-sm md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-medium">{creator.name}</span> <span className="text-muted">· {creator.handle}</span>
        </p>
          <a href="#top" className="self-start md:self-auto inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 hover:border-ink">
            Back to top <span aria-hidden>↑</span>
          </a>
        <p className="text-muted">© 2026 {creator.name}.</p>
      </div>
      <div aria-hidden className="relative mt-10 text-center">
        <span className={type} style={{ WebkitTextStroke: "1px var(--color-ink)", color: "transparent" }}>
          {word}
        </span>
        <motion.span style={{ y: outer }} className="absolute inset-0 overflow-hidden">
          <motion.span style={{ y: inner }} className={`${type} text-ink`}>
            {word}
          </motion.span>
        </motion.span>
      </div>
    </footer>
  );
}
