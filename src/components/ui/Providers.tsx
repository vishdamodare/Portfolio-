"use client";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { startLenis } from "@/lib/lenis";
import { dur, ease } from "@/lib/motion";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => startLenis(), []);
  // reducedMotion="user": transforms are dropped, opacity fades are kept.
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: dur.ui, ease: ease.reveal }}>
      {children}
    </MotionConfig>
  );
}
