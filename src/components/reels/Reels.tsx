"use client";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { creator, type MediaItem, type MediaKind } from "@/data/creator";
import { dur, ease } from "@/lib/motion";
import { whatsapp } from "@/lib/format";
import { jumpTo } from "@/lib/lenis";
import { useMedia } from "@/lib/reduced-motion";
import { SplitText } from "../ui/SplitText";

const collabHref = whatsapp(creator.phone, creator.collabReelMessage);

const FILTERS: [string, MediaKind | "all"][] = [
  ["All", "all"],
  ["Reels", "reel"],
  ["Photos", "photo"],
  ["Brand", "brand"],
];

function Tile({ item, onOpen, jack }: { item: MediaItem; onOpen: () => void; jack: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const inView = useInView(btn, { margin: "0px 0px -10% 0px" });
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce]);
  const shape = jack ? "h-[58svh]" : "w-full";

  if (item.placeholder) {
    return (
      <div style={{ aspectRatio: jack ? `${item.width}/${item.height}` : "9/16" }} className={`grid place-items-center rounded-3xl border border-dashed border-ink/30 bg-lavender/50 p-4 text-center text-xs text-accent ${shape}`}>
        <span>
          <strong className="block text-sm">Brand content</strong>
          {item.alt}
        </span>
      </div>
    );
  }
  return (
    <button
      ref={btn}
      type="button"
      onClick={onOpen}
      aria-label={`Open: ${item.alt}`}
      style={{ aspectRatio: jack ? `${item.width}/${item.height}` : "9/16" }}
      className={`group relative block overflow-hidden rounded-3xl bg-ink ${shape}`}
    >
      <Image src={item.src} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="kenburns object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0" />
      {/* Muted inline loop, only while on screen (saves data and battery). */}
      {item.video && (
        <video ref={video} src={item.video} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />
      )}
      {item.video && (
        <span aria-hidden className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/85 text-xs text-ink">
          ▶
        </span>
      )}
      <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium capitalize text-ink">{item.kind}</span>
    </button>
  );
}

function Lightbox({ items, index, setIndex }: { items: MediaItem[]; index: number | null; setIndex: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = index === null ? null : items[index];
  const go = useCallback((d: number) => index !== null && setIndex((index + d + items.length) % items.length), [index, items.length, setIndex]);

  useEffect(() => {
    const dlg = ref.current!;
    if (item && !dlg.open) dlg.showModal();
    if (!item && dlg.open) dlg.close();
  }, [item]);

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      aria-label="Media viewer"
      onClose={() => setIndex(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-canvas backdrop:bg-ink/80"
    >
      {item && (
        <div className="flex h-full items-center justify-center gap-4 p-4">
          <button type="button" onClick={() => go(-1)} aria-label="Previous" className="hidden size-12 rounded-full border border-canvas/30 md:block">
            ←
          </button>
          <AnimatePresence mode="wait">
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: dur.micro * 1.5, ease: ease.reveal }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              className="relative aspect-[9/16] h-[min(86svh,160vw)] overflow-hidden rounded-3xl bg-black"
            >
              {item.video ? (
                <video src={item.video} poster={item.src} controls autoPlay muted playsInline className="h-full w-full object-contain" />
              ) : (
                <Image src={item.src} alt={item.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="pointer-events-none object-contain" />
              )}
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 p-4 text-sm">
                <span>{item.alt}</span>
                {item.instagram && (
                  <a href={item.instagram} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-canvas px-3 py-1.5 text-xs font-medium text-ink">
                    Watch on Instagram ↗
                  </a>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <button type="button" onClick={() => go(1)} aria-label="Next" className="hidden size-12 rounded-full border border-canvas/30 md:block">
            →
          </button>
          <button type="button" onClick={() => setIndex(null)} aria-label="Close" className="absolute right-4 top-4 size-12 rounded-full bg-canvas text-ink">
            ✕
          </button>
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-canvas/60 md:hidden">Swipe to browse</p>
        </div>
      )}
    </dialog>
  );
}

export function Reels() {
  const [filter, setFilter] = useState<MediaKind | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const items = creator.media.filter((m) => filter === "all" || m.kind === filter);
  const viewable = items.filter((m) => !m.placeholder);

  const desktop = useMedia("(min-width: 768px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const jack = desktop && !reduce;

  // Horizontal scroll-jacking: sticky stage + vertical scroll mapped to x.
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    if (!jack) return;
    const t = track.current!;
    const measure = () => setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [jack]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * dist);

  // Changing the filter changes the track length (and section height). Snap back to the
  // start of the strip so the page doesn't jump past the section mid-scroll.
  const pickFilter = (key: MediaKind | "all") => {
    setFilter(key);
    const sec = ref.current;
    if (jack && sec && window.scrollY > sec.offsetTop) jumpTo(sec.offsetTop);
  };

  const header = (
    <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">Reels &amp; photos</p>
        <SplitText as="h2" text="Made to *stop* the scroll." className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl" />
      </div>
      <div role="group" aria-label="Filter media" className="flex flex-wrap gap-2">
        {FILTERS.filter(([, key]) => key === "all" || creator.media.some((m) => m.kind === key)).map(([label, key]) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => pickFilter(key)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${filter === key ? "bg-ink text-canvas" : "border border-line hover:border-ink"}`}
          >
            {label}
          </button>
        ))}
        <a
          href={collabHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Book a collab reel <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );

  return (
    <section id="reels" ref={ref} aria-label="Reels and photos" className={jack ? "relative" : "section"} style={jack ? { height: `calc(100svh + ${dist}px)` } : undefined}>
      <div className={jack ? "sticky top-0 flex h-svh flex-col justify-center gap-10 overflow-hidden pt-16" : ""}>
        {header}
        <motion.ul
          ref={track}
          style={jack ? { x } : undefined}
          className={jack ? "flex w-max items-center gap-5 px-10" : "container-x mt-10 grid grid-cols-2 gap-3"}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: dur.ui, ease: ease.reveal }}
                              >
                <Tile item={item} jack={jack} onOpen={() => setOpen(viewable.indexOf(item))} />
              </motion.li>
            ))}
          </AnimatePresence>
          {/* Always-last tile: a direct WhatsApp ask for a collaboration reel. */}
          <motion.li layout transition={{ duration: dur.ui, ease: ease.reveal }}>
            <a
              href={collabHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ aspectRatio: "9/16" }}
              className={`group flex flex-col justify-between rounded-3xl bg-accent p-6 text-white ${jack ? "h-[58svh]" : "w-full"}`}
            >
              <span className="text-xs uppercase tracking-[0.24em] text-white/80">Collab reel</span>
              <span className="font-display text-4xl leading-[0.95] md:text-5xl">
                Your brand
                <br />
                <em>here.</em>
              </span>
              <span className="flex items-center justify-between gap-2 text-sm font-medium">
                Chat on WhatsApp
                <span aria-hidden className="grid size-10 place-items-center rounded-full bg-white text-accent transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </span>
            </a>
          </motion.li>
        </motion.ul>
      </div>
      <Lightbox items={viewable} index={open} setIndex={setOpen} />
    </section>
  );
}
