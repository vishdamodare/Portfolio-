"use client";
import { useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";

type Props = {
  /** Wrap words in *asterisks* for italic emphasis. Use "\n" for a line break. */
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  italicClass?: string;
};

// One observer per heading; characters are plain spans animated by CSS (.split-char in globals.css).
// Keeps hydration cheap: no per-character motion components.
export function SplitText({ text, as: Tag = "h2", className, italicClass = "italic" }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shown = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const tokens = text.split(/( |\n)/).filter((t) => t !== "");
  let n = 0;

  return (
    <Tag ref={ref} data-shown={shown || undefined} className={className} aria-label={text.replace(/\*/g, "").replace(/\n/g, " ")}>
      {tokens.map((tok, ti) => {
        if (tok === "\n") return <br key={ti} />;
        if (tok === " ") return " ";
        const word = tok.replace(/\*/g, "");
        return (
          <span key={ti} aria-hidden className="-mx-[0.08em] inline-block overflow-hidden px-[0.08em] pb-[0.14em] -mb-[0.14em] align-top">
            <span className={tok.startsWith("*") ? italicClass : undefined}>
              {[...word].map((ch, ci) => (
                <span key={ci} className="split-char" style={{ "--i": n++ } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
