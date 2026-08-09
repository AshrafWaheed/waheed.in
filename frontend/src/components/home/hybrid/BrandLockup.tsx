'use client';

/**
 * BrandLockup — the pre-footer sign-off band from the Figma redesign.
 *
 * The giant "waheed" wordmark bleeding off the bottom, with the tagline threaded
 * across the top so the wordmark's tall arcs rise into the gap between its two
 * halves: "The Long-Term" on the left, "Partner for Your Halal Brand" on the
 * right. Mounted on the homepage above the (unchanged) global footer.
 *
 * The wordmark uses the same invert-hue-flip filter the footer/OG card use, so
 * the two teal arcs stay distinct instead of smudging into the letters.
 */
import { brandLockup } from '@/content/home';

export default function BrandLockup() {
  const { pre, post } = brandLockup;
  return (
    <section className="lk" data-section-color="dark">
      <div className="cnt lk-tagwrap">
        <span className="lk-tag lk-tag--pre">{pre}</span>
        <span className="lk-tag lk-tag--post">{post}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lk-mark" src="/logo.png" alt="Waheed" />
    </section>
  );
}
