"use server";
import { z } from "zod";
import { creator } from "@/data/creator";
import { mailto } from "@/lib/format";

const PACKAGES: [string, ...string[]] = ["Not sure yet", ...creator.packages.map((p) => p.name)];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email.").max(160),
  brand: z.string().trim().max(120).default(""),
  pkg: z.enum(PACKAGES, "Pick a package."),
  message: z.string().trim().min(10, "Tell me a little more (10+ characters).").max(2000),
  website: z.string().max(0), // honeypot: real people leave it empty
});

export type ContactState = {
  status: "idle" | "ok" | "error" | "fallback";
  message?: string;
  errors?: Partial<Record<string, string>>;
  mailto?: string;
};

export async function sendEnquiry(_: ContactState, form: FormData): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return { status: "ok", message: "Thanks!" };
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const { name, email, brand, pkg, message } = parsed.data;
  const subject = `Enquiry: ${pkg} — ${name}${brand ? ` (${brand})` : ""}`;
  const text = `Name: ${name}\nEmail: ${email}\nBrand: ${brand || "—"}\nPackage: ${pkg}\n\n${message}`;

  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "fallback", message: "Opening your email app…", mailto: mailto(creator.email, subject, text) };

  try {
    const { Resend } = await import("resend");
    const { error } = await new Resend(key).emails.send({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: creator.email,
      replyTo: email,
      subject,
      text,
    });
    if (error) throw new Error(error.message);
    return { status: "ok", message: "Sent! I'll get back to you soon." };
  } catch (e) {
    console.error("contact: send failed", e);
    return { status: "fallback", message: "Couldn't send right now. Opening your email app instead…", mailto: mailto(creator.email, subject, text) };
  }
}
