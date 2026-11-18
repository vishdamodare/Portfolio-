export type MediaKind = "reel" | "photo" | "brand";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional clip, e.g. "/media/reel-1.mp4" (9:16, H.264 MP4, < 8MB). Plays muted in the tile while on screen. */
  video?: string;
  /** Optional link to the original post, e.g. "https://www.instagram.com/reel/XXXX/". Shown in the viewer. */
  instagram?: string;
  /** True for slots still waiting on real content. */
  placeholder?: boolean;
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const creator = {
  name: "Abhishek Soni",
  handle: "@er.abhiii",
  role: "Fitness & Lifestyle Content Creator",
  location: "Mumbai, India",
  bio: "I'm all about crafting fun and captivating lifestyle content like photos, videos, and stories for social media and beyond!",
  tagline: "*Lifestyle* that moves.",
  phone: "+91 7304338493",
  whatsappMessage: "Hi Abhishek! I found you through your website and I'd like to discuss a brand collaboration.",
  email: "abhisheksoni0028@gmail.com",
  instagram: "https://instagram.com/er.abhiii",

  // Headline stats (media kit + insights export, 13 Nov 2026)
  stats: {
    followers: 11657, // shown as "11.7K"
    monthlyViews: 29_000_000, // media kit: "29M monthly views"
    interactions: 2_200_000, // media kit: "2.2M interaction"
  },

  insightsPeriod: "15 Aug – 13 Nov 2026",

  // 90-day Instagram insights, 15 Aug – 13 Nov 2026 (aggregated across reels and posts)
  insights90d: {
    reelViews: 32_000_000,
    viewers: 14_000_000,
    likes: 2_200_000,
    comments: 8_200,
    reposts: 26_000,
    shares: 757_000,
    saves: 108_000,
    reels: 591,
  },

  // Audience (follower insights, same 90-day window)
  audience: {
    gender: { women: 27.8, men: 72.2 },
    age: { "13-17": 11.6, "18-24": 31.1, "25-34": 33.2, "35-44": 15.7, "45-54": 5.3, "55-64": 1.9, "65+": 1.2 } as Record<string, number>,
    countries: [
      ["India", 85.7],
      ["Pakistan", 2.5],
      ["Bangladesh", 1.6],
      ["Saudi Arabia", 1.1],
      ["Indonesia", 1.0],
    ] as [string, number][],
    cities: [
      ["Mumbai", 30.6],
      ["Delhi", 7.4],
      ["Bangalore", 5.7],
      ["Chennai", 4.4],
      ["Pune", 3.9],
    ] as [string, number][],
  },

  services: [
    { name: "Social Media Posting", desc: "Posts and stories on @er.abhiii, made for your brand." },
    { name: "IG Reel / YouTube Shorts", desc: "Short vertical videos for Instagram Reels and YouTube Shorts." },
    { name: "Brand Collaboration", desc: "Content we make together, with proper tagging and location." },
    { name: "Brand Ambassadorship", desc: "An ongoing partnership where I represent your brand." },
    { name: "Product Review", desc: "I try your product and share my take on camera." },
    { name: "Vlog Feature", desc: "Your brand, featured inside my vlog content." },
    { name: "Fashion Modelling", desc: "Modelling for your fashion shoots." },
  ],

  // Rate card, INR
  packages: [
    { name: "UGC", price: 9000, blurb: "Aesthetic, authentic UGC content for your brand.", featured: false },
    { name: "UGC + Paid Ads Usage", price: 12000, blurb: "Create + use the content for paid promotions.", featured: false },
    { name: "UGC + Add Usage", price: 18000, blurb: "Create content with usage across your brand channels.", featured: true },
    { name: "Collab + Add Usage", price: 23000, blurb: "Collaborate with me + get usage for your brand.", featured: true },
  ],
  packageNotes: [
    "Content usage terms (duration and platforms), revisions and turnaround are shared when you enquire.",
    "Selected raw footage, proper tagging and location are part of every collaboration.",
  ],

  pastBrands: [
    { name: "Fygo", logo: "/media/logo-fygo.webp" },
    { name: "Denver", logo: "/media/logo-denver.webp" },
    { name: "Rule 34", logo: "/media/logo-rule34.webp" },
  ],

  portrait: {
    src: "/media/portrait.webp",
    width: 908,
    height: 1210,
    alt: "Abhishek Soni in a leather jacket on stone palace steps at night, black and white",
  },

  // Reel covers come from the insights export; photos from the media kit.
  media: [
    { id: "r1", kind: "reel", src: "/media/reel-1.webp", video: "/media/reel-1.mp4", width: 720, height: 1280, alt: "Reel: Abhishek and a friend dancing at an event" },
    { id: "r7", kind: "reel", src: "/media/reel-7.webp", video: "/media/reel-7.mp4", width: 720, height: 1280, alt: "Reel: Abhishek in a white shirt, scrolling his phone" },
    { id: "p1", kind: "photo", src: "/media/photo-stage.webp", width: 1067, height: 1600, alt: "Abhishek performing on stage under blue lights" },
    { id: "r8", kind: "reel", src: "/media/reel-8.webp", video: "/media/reel-8.mp4", width: 720, height: 1280, alt: "Reel: getting ready backstage with the makeup team" },
    { id: "p3", kind: "photo", src: "/media/photo-pg-loop.webp", width: 1200, height: 1600, alt: "Abhishek on stage at P&G LOOP: The Creator Collective" },
    { id: "r3", kind: "reel", src: "/media/reel-3.webp", video: "/media/reel-3.mp4", width: 720, height: 1280, alt: "Reel: Abhishek in a red jacket and loose tie in a red-lit room" },
    { id: "p2", kind: "photo", src: "/media/photo-steps.webp", width: 1200, height: 1600, alt: "Abhishek in a red leather jacket on stone palace steps at night" },
    { id: "r2", kind: "reel", src: "/media/reel-2.webp", width: 565, height: 1004, alt: "Reel cover: Abhishek in a black blazer in a red-lit room" },
    { id: "r5", kind: "reel", src: "/media/reel-5.webp", width: 565, height: 1004, alt: "Reel cover: close-up selfie in a red jacket" },
    { id: "r6", kind: "reel", src: "/media/reel-6.webp", width: 565, height: 1004, alt: "Reel cover: Abhishek and a friend in suits outdoors at night" },
  ] as MediaItem[],
};
