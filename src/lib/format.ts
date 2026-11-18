const compactFmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const intFmt = new Intl.NumberFormat("en-IN");

// Shared button classes (plain strings so server and client components can both use them).
export const pill =
  "inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-canvas transition-colors duration-200 hover:bg-accent";
export const pillSm =
  "inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-colors duration-200 hover:bg-accent";

export const mailto = (to: string, subject: string, body = "") =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

/** WhatsApp click-to-chat with a pre-filled message. `phone` may contain spaces and "+". */
export const whatsapp = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export type FormatKey = "compact" | "inr" | "int" | "pct";

/** Display-only rounding: 11657 → "11.7K", 32_000_000 → "32M". */
export const compact = (n: number) => compactFmt.format(n);
export const inr = (n: number) => `₹${inrFmt.format(n)}`;
export const pct = (n: number) => `${n.toFixed(1)}%`;

export function format(n: number, key: FormatKey) {
  if (key === "compact") return compact(n);
  if (key === "inr") return inr(n);
  if (key === "pct") return pct(n);
  return intFmt.format(Math.round(n));
}
