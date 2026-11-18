"use client";
import Lenis from "lenis";
import { prefersReducedMotion } from "./reduced-motion";

let lenis: Lenis | null = null;

/** Starts smooth scrolling unless the user prefers reduced motion. */
export function startLenis() {
  if (lenis || prefersReducedMotion()) return () => {};
  lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Instantly moves the page to `y`, keeping Lenis in sync (no smooth glide). */
export function jumpTo(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "instant" });
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  // Move focus for keyboard and screen-reader users.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
