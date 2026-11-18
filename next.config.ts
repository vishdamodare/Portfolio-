import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Optimised images stay cached for 31 days instead of being re-generated every few hours.
  images: { formats: ["image/avif", "image/webp"], qualities: [60, 75], minimumCacheTTL: 2678400 },
  // Photos/videos in /public/media: cache 7 days in browsers + CDN, then refresh in the background.
  // (Rename a file when you replace it so visitors get the new one immediately.)
  async headers() {
    return [
      {
        source: "/media/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
