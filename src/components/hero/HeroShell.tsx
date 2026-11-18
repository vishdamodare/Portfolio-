"use client";
import dynamic from "next/dynamic";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { creator } from "@/data/creator";
import { dur, ease, springCfg } from "@/lib/motion";
import { useMedia } from "@/lib/reduced-motion";
import { CountUp } from "../ui/CountUp";
import { Sparkle } from "../ui/Sparkle";

const OrbitScene = dynamic(() => import("./OrbitScene"), { ssr: false });

const cards = [
  { value: creator.stats.followers, label: "followers", note: "Instagram", pos: "md:left-[3%] md:top-[6%]", lis: { ax: 12, ay: 9, a: 0.5, b: 0.7, d: 0 } },
  { value: creator.insights90d.reelViews, label: "reel views", note: "Last 90 days", pos: "md:right-[3%] md:top-[0%]", lis: { ax: 10, ay: 12, a: 0.6, b: 0.4, d: 1.3 } },
  { value: creator.insights90d.viewers, label: "viewers", note: "Last 90 days", pos: "md:left-[11%] md:bottom-[8%]", lis: { ax: 9, ay: 11, a: 0.45, b: 0.65, d: 2.1 } },
  { value: creator.insights90d.likes, label: "likes", note: "Last 90 days", pos: "md:right-[10%] md:bottom-[16%]", lis: { ax: 13, ay: 8, a: 0.55, b: 0.5, d: 0.7 } },
];

// Curves from each card toward the portrait (viewBox 1000×600).
const lines = ["M140 150 C 220 330, 330 340, 410 300", "M860 110 C 800 260, 690 250, 600 250", "M220 470 C 300 470, 340 430, 410 420", "M800 430 C 720 450, 660 410, 595 400"];

function StatCard({ c, i, mx, my, animate }: { c: (typeof cards)[number]; i: number; mx: MotionValue<number>; my: MotionValue<number>; animate: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const live = useRef(animate);
  useEffect(() => {
    live.current = animate;
  }, [animate]);
  useAnimationFrame((t) => {
    if (!live.current) return;
    const s = t / 1000;
    x.set(c.lis.ax * Math.sin(c.lis.a * s + c.lis.d));
    y.set(c.lis.ay * Math.sin(c.lis.b * s));
  });
  const rotateY = useTransform(mx, (v) => v * 14);
  const rotateX = useTransform(my, (v) => -v * 14);
  const px = useTransform(mx, (v) => v * 18);
  const py = useTransform(my, (v) => v * 18);

  return (
    <motion.div style={{ x: px, y: py }} className={`md:absolute ${c.pos}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: dur.reveal, ease: ease.reveal, delay: 0.35 + i * 0.08 }}
        style={{ x, y, rotateX, rotateY, transformPerspective: 800 }}
        className="glass rounded-3xl px-5 py-4 text-left md:w-[210px]"
      >
        <p className="flex items-center gap-2 text-xs text-muted">
          <span className="grid size-6 place-items-center rounded-full bg-lavender text-accent">
            <Sparkle className="size-3" />
          </span>
          {c.note}
        </p>
        <p className="mt-3 font-num text-4xl font-semibold leading-none">
          <CountUp value={c.value} fmt="compact" />
        </p>
        <p className="mt-1 text-sm">{c.label}</p>
      </motion.div>
    </motion.div>
  );
}

export function HeroShell({ text, trusted, portrait }: { text: ReactNode; trusted: ReactNode; portrait: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const animate = inView && desktop && !reduce;

  // Lazy-mount the 3D ring after the page settles; desktop only.
  const [show3d, setShow3d] = useState(false);
  useEffect(() => {
    if (!desktop || reduce) return;
    const id = setTimeout(() => setShow3d(true), 2200);
    return () => clearTimeout(id);
  }, [desktop, reduce]);

  // Pointer → tilt, mouse parallax and the cursor light.
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, springCfg);
  const my = useSpring(myRaw, springCfg);
  const lx = useSpring(-600, springCfg);
  const ly = useSpring(-600, springCfg);
  useEffect(() => {
    if (!animate) return;
    const el = ref.current!;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mxRaw.set(((e.clientX - r.left) / r.width) * 2 - 1);
      myRaw.set(((e.clientY - r.top) / r.height) * 2 - 1);
      lx.set(e.clientX - r.left);
      ly.set(e.clientY - r.top);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [animate, mxRaw, myRaw, lx, ly]);

  // Three depth levels of scroll parallax.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yNear = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yFar = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section id="top" ref={ref} aria-label="Intro" className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
      {/* One soft radial glow + cursor light */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(ellipse_at_50%_35%,#f6dcdc_0%,transparent_60%)] opacity-70" />
      <motion.div
        aria-hidden
        style={{ x: lx, y: ly }}
        className="pointer-events-none absolute left-0 top-0 -ml-[280px] -mt-[280px] hidden size-[560px] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.9),transparent_65%)] md:block"
      />

      {/* Rotating badge (far layer) */}
      <motion.div style={{ y: yFar }} className="absolute right-[5%] top-28 z-10 hidden md:block">
        <div className="relative size-28">
          <svg viewBox="0 0 100 100" aria-hidden className="spin-slow absolute inset-0">
            <defs>
              <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-ink text-[8px] font-medium uppercase">
              <textPath href="#badge-circle" textLength="236">
                Create · Collaborate · Grow ·
              </textPath>
            </text>
          </svg>
          <Sparkle className="absolute inset-0 m-auto size-6" />
        </div>
      </motion.div>
      <motion.div style={{ y: yFar }} aria-hidden className="absolute left-[8%] top-[46%] hidden text-ink md:block">
        <Sparkle className="size-5" />
      </motion.div>

      {text}

      {/* Stage */}
      <div className="relative mx-auto mt-10 max-w-[1180px] md:mt-6">
        {show3d && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-10 bottom-0 grayscale">
            <OrbitScene active={inView} />
          </div>
        )}

        <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
          {lines.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity={0.25}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: ease.reveal, delay: 0.5 + i * 0.08 }}
            />
          ))}
        </svg>

        <motion.div style={{ y: yNear }} className="relative z-10 mx-auto aspect-[3/4] w-[min(72vw,380px)] overflow-hidden rounded-b-[2rem] rounded-t-full bg-ink/10">
          {portrait}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-canvas/70 to-transparent" />
        </motion.div>

        <motion.div style={{ y: desktop ? yMid : undefined }} className="container-x relative z-20 mt-6 grid grid-cols-2 gap-3 md:absolute md:inset-0 md:mt-0 md:block md:max-w-none md:p-0">
          {cards.map((c, i) => (
            <StatCard key={c.label} c={c} i={i} mx={mx} my={my} animate={animate} />
          ))}
        </motion.div>
      </div>

      <div className="container-x relative z-20 mt-10 lg:absolute lg:bottom-16 lg:left-0 lg:right-0 lg:mt-0">{trusted}</div>
    </section>
  );
}
