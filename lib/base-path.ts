/**
 * GitHub Pages serves a project repo from a sub-path, so the build sets a
 * `basePath`. next/link and next/image prefix it automatically; raw asset
 * references (plain <img>, inline url(), <a href> to a file) do not — wrap
 * those in `asset()`.
 *
 * Empty string in dev / at the site root, so it's a no-op there.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-absolute public asset path (e.g. "/images/x.png") with basePath. */
export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
