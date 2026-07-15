declare const __ASSET_BUILD_VERSION__: string;

/**
 * Appends ?v=<build-id> to local static image URLs so browsers fetch fresh
 * files after a new deploy (e.g. when Keystatic replaces an image at the same path).
 */
export function cacheBustUrl(url: string | undefined): string {
  if (!url?.trim()) return url ?? "";

  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const base = trimmed.split("?")[0];
  return `${base}?v=${__ASSET_BUILD_VERSION__}`;
}
