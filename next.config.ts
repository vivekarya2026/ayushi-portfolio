import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * A GitHub *project* repo is served from a sub-path
 * (https://<user>.github.io/ayushi-portfolio/), so production builds need a
 * matching `basePath`/`assetPrefix`. This is gated on the `GITHUB_PAGES` env
 * var (set by the deploy workflow) so local `dev`/`build` still serve from `/`.
 *
 * next/link and next/image apply basePath automatically. Raw asset references
 * (a plain <img>, an inline url(), an <a href> to a file) do NOT, so those use
 * the `asset()` helper in lib/base-path.ts, which reads NEXT_PUBLIC_BASE_PATH
 * exposed below.
 */
const basePath = process.env.GITHUB_PAGES === "true" ? "/ayushi-portfolio" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // A custom loader (vs `unoptimized: true`) so next/image src gets the
    // basePath prefix on GitHub Pages — unoptimized images skip basePath and
    // would 404 on the sub-path. The loader returns the file as-is (no resize).
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
