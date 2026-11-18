"use client";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useState } from "react";
import { sendEnquiry, type ContactState } from "@/app/actions/contact";
import { creator } from "@/data/creator";
import { pill, whatsapp } from "@/lib/format";
import { dur, ease } from "@/lib/motion";
import { SplitText } from "../ui/SplitText";

const field = "mt-2 w-full rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition-colors focus:border-ink";

function Field({ name, label, error, children }: { name: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      {label}
      {children}
      {error && (
        <span id={`${name}-err`} className="mt-1 block text-xs text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

export function Contact() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendEnquiry, { status: "idle" });
  const [toast, setToast] = useState("");
  const e = state.errors ?? {};
  const err = (k: string) => (e[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});

  useEffect(() => {
    if (state.status === "fallback" && state.mailto) window.location.href = state.mailto;
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(creator.email);
      setToast("Email copied to clipboard");
    } catch {
      window.location.href = `mailto:${creator.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-h" className="section">
      <div className="container-x grid gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow">Contact</p>
          <div className="relative mt-4 inline-block">
            <SplitText as="h2" text="Let’s *collab!*" italicClass="italic text-accent" className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.9]" />
            <span id="contact-h" className="sr-only">
              Contact
            </span>
            <svg aria-hidden viewBox="0 0 400 30" className="absolute -bottom-4 left-0 w-full text-accent" preserveAspectRatio="none">
              <motion.path
                d="M4 20 C 80 6, 160 26, 240 14 S 360 8, 396 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: ease.reveal, delay: 0.5 }}
              />
            </svg>
          </div>
          <p className="mt-10 max-w-md text-muted">Got a product, a campaign or an idea? Tell me about it and let&apos;s make something that moves.</p>

          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href={whatsapp(creator.phone, creator.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f7a4d] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#17603c]"
              >
                Chat on WhatsApp <span aria-hidden>↗</span>
              </a>
              <button type="button" onClick={copy} className={`${pill} justify-center`}>
                {creator.email} <span aria-hidden>⧉</span>
              </button>
              <a href={`tel:${creator.phone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3.5 text-sm hover:border-ink">
                {creator.phone}
              </a>
              <a href={creator.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3.5 text-sm hover:border-ink">
                Instagram {creator.handle} <span aria-hidden className="ml-1">↗</span>
              </a>
          </div>
        </div>

        <form action={action} className="space-y-5 md:col-span-6 md:pt-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Name" error={e.name}>
              <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} {...err("name")} />
            </Field>
            <Field name="email" label="Email" error={e.email}>
              <input name="email" type="email" required maxLength={160} autoComplete="email" className={field} {...err("email")} />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="brand" label="Brand / company" error={e.brand}>
              <input name="brand" maxLength={120} autoComplete="organization" className={field} />
            </Field>
            <Field name="pkg" label="Package" error={e.pkg}>
              <select name="pkg" required defaultValue="" className={field} {...err("pkg")}>
                <option value="" disabled>
                  Choose one
                </option>
                {creator.packages.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
                <option>Not sure yet</option>
              </select>
            </Field>
          </div>
          <Field name="message" label="Message" error={e.message}>
            <textarea name="message" required minLength={10} maxLength={2000} rows={5} className={field} {...err("message")} />
          </Field>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" defaultValue="" />
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={pending} className={`${pill} disabled:opacity-60`}>
              {pending ? "Sending…" : "Send enquiry"} <span aria-hidden>→</span>
            </button>
            <p role="status" aria-live="polite" className={`text-sm ${state.status === "error" ? "text-red-700" : "text-accent"}`}>
              {state.message}
            </p>
          </div>
        </form>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[96] flex justify-center">
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: dur.micro, ease: ease.reveal }}
              className="rounded-full bg-ink px-5 py-3 text-sm text-canvas shadow-xl"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
