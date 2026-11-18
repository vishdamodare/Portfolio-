import { creator } from "@/data/creator";
import { pillSm } from "@/lib/format";

const links = [
  ["Reels", "reels"],
  ["Numbers", "numbers"],
  ["Audience", "audience"],
  ["Packages", "packages"],
  ["Contact", "contact"],
] as const;

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-canvas/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="font-display text-2xl leading-none">
          {creator.name.split(" ")[0]}
          <sup className="ml-0.5 text-xs text-accent">°</sup>
        </a>
        <nav aria-label="Primary" className="glass hidden rounded-full px-2 py-1.5 md:block">
          <ul className="flex gap-1 text-sm">
            {links.map(([label, id]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded-full px-4 py-2 transition-colors hover:bg-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
          <a href="#packages" className={pillSm}>
            Work with me <span aria-hidden>↗</span>
          </a>
      </div>
    </header>
  );
}
