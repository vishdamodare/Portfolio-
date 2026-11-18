import Image from "next/image";
import { creator } from "@/data/creator";
import { pill } from "@/lib/format";
import { Sparkle } from "../ui/Sparkle";
import { HeroShell } from "./HeroShell";

function CssSplit({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span aria-hidden className="-mx-[0.06em] inline-block overflow-hidden px-[0.06em] pb-[0.12em] -mb-[0.12em]">
      {[...text].map((c, i) => (
        <span key={i} className="hero-char" style={{ "--i": i + offset } as React.CSSProperties}>
          {c}
        </span>
      ))}
    </span>
  );
}

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function Hero() {
  const [first, last] = creator.name.split(" ");
  const [italicWord, ...rest] = creator.tagline.split(" ");

  const text = (
    <div className="container-x relative z-10 flex flex-col items-center text-center">
      <p className="rise inline-flex items-center gap-2 rounded-full bg-lavender px-4 py-1.5 text-xs font-medium text-accent" style={d(0)}>
        <Sparkle className="size-3" /> Fitness &amp; Lifestyle Creator · Mumbai
      </p>
      <h1 aria-label={creator.name} className="mt-6 font-display text-[clamp(4.25rem,15vw,12rem)] leading-[0.84] tracking-[-0.025em]">
        <CssSplit text={first} />
        <br />
        <span className="italic text-accent">
          <CssSplit text={last} offset={first.length} />
        </span>
      </h1>
      <p className="rise mt-6 font-display text-2xl md:text-3xl" style={d(0.35)}>
        <em>{italicWord.replace(/\*/g, "")}</em> {rest.join(" ")}
      </p>
      <p className="rise mt-3 max-w-md text-balance text-muted" style={d(0.45)}>
        {creator.bio}
      </p>
      <div className="rise mt-8 flex flex-wrap justify-center gap-3" style={d(0.55)}>
          <a href="#reels" className={pill}>
            View reels <span aria-hidden>↓</span>
          </a>
          <a href="#packages" className={pill}>
            Work with me <span aria-hidden>→</span>
          </a>
      </div>
    </div>
  );

  const trusted = (
    <div className="rise flex items-center gap-4 lg:block" style={d(0.8)}>
      <span aria-hidden className="mb-3 hidden h-px w-10 bg-ink/30 lg:block" />
      <p className="max-w-[15rem] text-sm text-muted">
        Trusted by brands like {creator.pastBrands.slice(0, -1).map((b) => b.name).join(", ")} and {creator.pastBrands.at(-1)!.name}
      </p>
      <div className="flex -space-x-3 lg:mt-3">
        {creator.pastBrands.map((b) => (
          <Image key={b.name} src={b.logo} alt="" width={40} height={40} className="size-10 rounded-full border-2 border-canvas object-cover" />
        ))}
      </div>
    </div>
  );

  const portrait = (
    <Image
      src={creator.portrait.src}
      alt={creator.portrait.alt}
      width={creator.portrait.width}
      height={creator.portrait.height}
      loading="eager"
      fetchPriority="high"
      sizes="(min-width: 768px) 380px, 72vw"
      quality={60}
      className="h-full w-full object-cover"
    />
  );

  return <HeroShell text={text} trusted={trusted} portrait={portrait} />;
}
