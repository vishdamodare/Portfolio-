"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { creator } from "@/data/creator";
import { pct } from "@/lib/format";
import { dur, ease } from "@/lib/motion";
import { CountUp } from "../ui/CountUp";
import { SplitText } from "../ui/SplitText";
import { IndiaMap } from "./IndiaMap";

const a = creator.audience;
const ages = Object.entries(a.age);
const CORE = ["18-24", "25-34"];
const coreShare = CORE.reduce((s, k) => s + a.age[k], 0);
const source = `Source: Instagram follower insights, ${creator.insightsPeriod}.`;
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -15% 0px" } } as const;

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={`rounded-[2rem] border border-line bg-white/60 p-6 md:p-8 ${className}`}>
      <p className="eyebrow">{title}</p>
      {children}
    </figure>
  );
}

function Bars({ rows, max, highlight = [] }: { rows: [string, number][]; max: number; highlight?: string[] }) {
  return (
    <motion.ul {...inView} className="mt-6 space-y-4" aria-hidden>
      {rows.map(([k, v], i) => (
        <li key={k}>
          <div className="flex justify-between text-sm">
            <span>{k}</span>
            <span className="font-num font-semibold tabular-nums">{pct(v)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line/70">
            <motion.div
              className={`h-full origin-left rounded-full ${highlight.includes(k) ? "bg-accent" : "bg-ink/70"}`}
              style={{ width: `${(v / max) * 100}%` }}
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: dur.reveal, ease: ease.reveal, delay: i * 0.08 } } }}
            />
          </div>
        </li>
      ))}
    </motion.ul>
  );
}

function Table({ caption, rows, head }: { caption: string; rows: [string, number][]; head: string }) {
  return (
    <table className="mt-6 w-full text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-line text-muted">
          <th scope="col" className="py-2 font-normal">
            {head}
          </th>
          <th scope="col" className="py-2 text-right font-normal">
            Share of followers
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-line/60">
            <th scope="row" className="py-2 font-normal">
              {k}
            </th>
            <td className="py-2 text-right font-num tabular-nums">{pct(v)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Insights() {
  const [tables, setTables] = useState(false);
  const gender: [string, number][] = [
    ["Men", a.gender.men],
    ["Women", a.gender.women],
  ];

  return (
    <section id="audience" aria-labelledby="audience-h" className="section">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Audience · last 90 days</p>
            <SplitText as="h2" text="Who’s *watching*." className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl" />
            <span id="audience-h" className="sr-only">
              Audience insights
            </span>
          </div>
          <button type="button" aria-pressed={tables} onClick={() => setTables((t) => !t)} className="self-start rounded-full border border-line px-4 py-2 text-sm hover:border-ink md:self-auto">
            {tables ? "Show charts" : "Show data tables"}
          </button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card title="Gender">
            <figcaption className="sr-only">Followers by gender: men {pct(a.gender.men)}, women {pct(a.gender.women)}.</figcaption>
            {tables ? (
              <Table caption="Followers by gender" head="Gender" rows={gender} />
            ) : (
              <>
                <div className="relative mx-auto mt-6 size-52" aria-hidden>
                  <motion.svg viewBox="0 0 200 200" className="-rotate-90" {...inView}>
                    <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-line)" strokeWidth="14" />
                    <motion.circle
                      cx="100" cy="100" r="80" fill="none" stroke="var(--color-ink)" strokeWidth="14" strokeLinecap="round"
                      variants={{ hidden: { pathLength: 0 }, show: { pathLength: a.gender.men / 100 - 0.01, transition: { duration: dur.hero, ease: ease.reveal } } }}
                    />
                    <g transform={`rotate(${(a.gender.men / 100) * 360} 100 100)`}>
                      <motion.circle
                        cx="100" cy="100" r="80" fill="none" stroke="var(--color-accent)" strokeWidth="14" strokeLinecap="round"
                        variants={{ hidden: { pathLength: 0 }, show: { pathLength: a.gender.women / 100 - 0.01, transition: { duration: dur.hero, ease: ease.reveal, delay: 0.3 } } }}
                      />
                    </g>
                  </motion.svg>
                  <div className="absolute inset-0 grid place-content-center text-center">
                    <span className="font-num text-3xl font-semibold">
                      <CountUp value={creator.stats.followers} fmt="int" />
                    </span>
                    <span className="text-xs text-muted">followers</span>
                  </div>
                </div>
                <ul className="mt-6 flex justify-center gap-8 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-ink" /> Men <b className="font-num">{pct(a.gender.men)}</b>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-accent" /> Women <b className="font-num">{pct(a.gender.women)}</b>
                  </li>
                </ul>
              </>
            )}
          </Card>

          <Card title="Age" className="md:col-span-2">
            <figcaption className="mt-2 text-sm text-muted">
              Core audience 18–34: <b className="font-num text-ink">{pct(coreShare)}</b> of followers.
              <span className="sr-only"> Full breakdown: {ages.map(([k, v]) => `${k} ${pct(v)}`).join(", ")}.</span>
            </figcaption>
            {tables ? <Table caption="Followers by age" head="Age" rows={ages} /> : <Bars rows={ages} max={40} highlight={CORE} />}
          </Card>

          <Card title="Where they are" className="md:col-span-2">
            <figcaption className="sr-only">Map of India with Mumbai highlighted. Mumbai is the top city at {pct(a.cities[0][1])} of followers.</figcaption>
            <IndiaMap mumbai={a.cities[0][1]} />
          </Card>

          <Card title="Top countries & cities">
            <figcaption className="sr-only">
              Countries: {a.countries.map(([k, v]) => `${k} ${pct(v)}`).join(", ")}. Cities: {a.cities.map(([k, v]) => `${k} ${pct(v)}`).join(", ")}.
            </figcaption>
            {tables ? (
              <>
                <Table caption="Top countries" head="Country" rows={a.countries} />
                <Table caption="Top cities" head="City" rows={a.cities} />
              </>
            ) : (
              <>
                <Bars rows={a.countries} max={100} highlight={["India"]} />
                <p className="mt-8 text-sm text-muted">Top cities</p>
                <Bars rows={a.cities} max={40} highlight={["Mumbai"]} />
              </>
            )}
          </Card>
        </div>
        <p className="mt-6 text-xs text-muted">{source}</p>
      </div>
    </section>
  );
}
