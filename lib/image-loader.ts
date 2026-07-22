/**
 * Custom next/image loader for the static export.
 *
 * `next/image` with `unoptimized: true` emits the bare `src`, ignoring
 * `basePath` — so on the GitHub Pages sub-path every image would 404. A custom
 * loader runs for every <Image> and lets us prefix `basePath` ourselves. It
 * returns the original file path (no resizing), so images are still served
 * as-is, just from the correct URL.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string }): string {
  // Leave remote/absolute and data URLs untouched; only prefix local paths.
  if (!src.startsWith("/") || src.startsWith("//")) return src;
  return `${BASE_PATH}${src}`;
}
