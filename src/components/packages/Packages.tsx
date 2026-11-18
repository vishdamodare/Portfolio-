import { creator } from "@/data/creator";
import { pill, whatsapp } from "@/lib/format";
import { CountUp } from "../ui/CountUp";
import { Sparkle } from "../ui/Sparkle";
import { SplitText } from "../ui/SplitText";
import { Tilt } from "../ui/Tilt";

export function Packages() {
  return (
    <section id="packages" aria-labelledby="packages-h" className="section">
      <div className="container-x">
        <p className="eyebrow">Rate card</p>
        <SplitText as="h2" text={"Create. Collaborate.\nGrow *Together.*"} className="mt-4 font-display text-5xl leading-[0.95] md:text-8xl" />
        <span id="packages-h" className="sr-only">
          Packages
        </span>
        <p className="mt-6 max-w-lg text-muted">Four packages for creators, campaigns and collaborations. All rates in INR.</p>

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {creator.packages.map((p) => {
            const dark = p.featured;
            return (
              <li key={p.name}>
                <Tilt
                  light={dark ? "rgb(246 220 220 / 0.18)" : "rgb(255 255 255 / 0.9)"}
                  className={`h-full rounded-[2rem] p-6 sm:p-8 md:p-10 ${dark ? "bg-ink text-canvas" : "border border-line bg-white/70"}`}
                >
                  <p className={`flex items-center gap-4 text-xs uppercase tracking-[0.24em] ${dark ? "text-canvas/70" : "text-muted"}`}>
                    Package <span aria-hidden className="h-px flex-1 bg-current opacity-40" />
                  </p>
                  <h3 className="mt-4 text-2xl font-medium">{p.name}</h3>
                  <p className="mt-2 font-num text-5xl font-semibold leading-none sm:text-6xl md:text-7xl">
                    <CountUp value={p.price} fmt="inr" />
                  </p>
                  <p className={`mt-4 max-w-xs ${dark ? "text-canvas/75" : "text-muted"}`}>{p.blurb}</p>
                  <a
                    href={whatsapp(creator.phone, `Hi Abhishek! I found you through your website and I'm interested in the ${p.name} package (₹${p.price.toLocaleString("en-IN")}). Can we discuss the details?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 md:mt-8 hover:underline ${dark ? "text-lavender" : "text-accent"}`}
                  >
                    Enquire about {p.name} <span aria-hidden>→</span>
                  </a>
                </Tilt>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Good to know</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {creator.packageNotes.map((n) => (
                <li key={n} className="flex gap-3">
                  <Sparkle className="mt-1 size-3 shrink-0 text-ink" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
            <a href={whatsapp(creator.phone, creator.whatsappMessage)} target="_blank" rel="noopener noreferrer" className={`${pill} self-start md:self-auto`}>
              Enquire about a package <span aria-hidden>→</span>
            </a>
        </div>
      </div>
    </section>
  );
}
