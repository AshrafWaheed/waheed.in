/**
 * Display host for a URL that may not be one.
 *
 * Both the fact gate and the variant panel render URLs that came from a model
 * or were typed by hand, and `new URL()` throws on anything malformed. In a
 * client component that throw takes down the whole page rather than the one
 * card, so it is caught here once instead of remembered at every call site.
 */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.slice(0, 40);
  }
}
