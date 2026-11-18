"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { springCfg } from "@/lib/motion";

/** 3D tilt toward the cursor with a specular spotlight that follows it. */
export function Tilt({ children, className = "", max = 7, light = "rgb(255 255 255 / 0.35)" }: { children: ReactNode; className?: string; max?: number; light?: string }) {
  const rx = useSpring(0, springCfg);
  const ry = useSpring(0, springCfg);
  const sx = useMotionValue(0);
  const sy = useMotionValue(0);
  const so = useSpring(0, springCfg);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    sx.set(e.clientX - r.left);
    sy.set(e.clientY - r.top);
    so.set(1);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
    so.set(0);
  };

  return (
    <motion.div
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -ml-40 -mt-40 size-80 rounded-full"
        style={{ x: sx, y: sy, opacity: so, background: `radial-gradient(circle, ${light}, transparent 62%)` }}
      />
    </motion.div>
  );
}
