"use client";
import { useState } from "react";
import { creator } from "@/data/creator";
import { SplitText } from "../ui/SplitText";

export function Services() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="services" aria-labelledby="services-h" className="section">
      <div className="container-x">
        <p className="eyebrow">Services</p>
        <SplitText as="h2" text="What we can *make*." className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl" />
        <span id="services-h" className="sr-only">
          Services
        </span>

        <ul className="mt-12 border-t border-line">
          {creator.services.map((s, i) => {
            const expanded = open === i;
            return (
              <li key={s.name} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`svc-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="group flex w-full items-center gap-6 py-6 text-left md:py-8"
                  >
                    <span className="font-num text-sm text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-display text-3xl transition-transform duration-500 ease-[var(--ease-reveal)] group-hover:translate-x-3 md:text-6xl">{s.name}</span>
                    <span aria-hidden className={`grid size-10 place-items-center rounded-full border border-line text-xl transition-transform duration-500 ${expanded ? "rotate-45 bg-ink text-canvas" : ""}`}>
                      +
                    </span>
                  </button>
                </h3>
                <div id={`svc-${i}`} role="region" className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-reveal)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden pl-12 text-muted md:pl-14">
                    <span className="block pb-6 md:text-lg">{s.desc}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
