// Confirm logo usage permission before launch
import Image from "next/image";
import { creator } from "@/data/creator";

export function Brands() {
  return (
    <section aria-labelledby="brands-h" className="pb-[72px] md:pb-[120px]">
      <div className="container-x flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <h2 id="brands-h" className="eyebrow">
          Selected brands
        </h2>
        <ul className="flex gap-4 md:gap-8">
          {creator.pastBrands.map((b) => (
            <li key={b.name}>
              <Image
                src={b.logo}
                alt={`${b.name} logo`}
                width={112}
                height={112}
                className="size-20 rounded-2xl object-cover opacity-80 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 md:size-28"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
