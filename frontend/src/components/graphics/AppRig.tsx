'use client';

/**
 * AppRig — the bespoke hero object for App Development.
 *
 * Distinct from the shared DeviceRig (which is web-first and reuses a single
 * phone as a detail): this is an app-only scene that states the page's promise —
 * one codebase shipped to two stores. A front phone carries the app, a second
 * phone sits behind it dimmed (the other platform, same build), a push
 * notification lands on the front phone on a loop, and a floating store-rating
 * card anchors the "in both stores" claim.
 *
 * Same floating-card language as the homepage collage and DeviceRig: solid light
 * objects on the gradient at different parallax depths (`.ab-lay` reads --k),
 * lifted by shadow, dimmed with brightness rather than opacity. Entrances ride
 * `.wa-hero.is-in` with per-slot `--d`. Reduced motion: the push does not loop.
 */
import { useEffect, useState } from 'react';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

/** The reusable phone body — same chrome as DeviceRig so it stays on-brand. */
function Phone() {
  return (
    <div className="wa-phone">
      <span className="wa-notch" />
      <div className="wa-scr">
        <div className="wa-status">
          <span className="wa-time">9:41</span>
          <span className="wa-sig"><i /><i /><i /></span>
        </div>
        <div className="wa-appbar">
          <span className="wa-ava" />
          <span className="wa-appbar-t" />
          <span className="wa-appbar-i" />
        </div>
        <div className="wa-pblk" />
        <div className="wa-pln w82" />
        <div className="wa-pln w58" />
        <div className="wa-ptiles"><span /><span /></div>
        <div className="wa-pcta">Continue</div>
        <div className="wa-plist">
          {[0, 1, 2].map((n) => (
            <span className="wa-prow" key={n}>
              <i />
              <span className="wa-prow-t"><b /><em /></span>
            </span>
          ))}
        </div>
        <div className="wa-tabs"><i /><i /><i /><i /></div>
      </div>
    </div>
  );
}

export default function AppRig() {
  // Re-key the push so its entrance replays on a loop; parked under reduced motion.
  const [ping, setPing] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setPing((p) => p + 1), 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="ar-rig" aria-hidden="true">
      <span className="wa-halo" />

      {/* The second platform — same build, sitting behind and dimmed. */}
      <div className="ar-slot ar-slot--back ab-lay" style={v({ '--k': 1.5, '--d': '.5s' })}>
        <Phone />
      </div>

      {/* The app, forward, with a push landing on it. */}
      <div className="ar-slot ar-slot--front ab-lay" style={v({ '--k': 2.8, '--d': '.7s' })}>
        <Phone />
        <div key={`push-${ping}`} className="wa-push">
          <span className="wa-push-i" />
          <span className="wa-push-txt"><b /><em /></span>
        </div>
      </div>

      {/* In both stores — a floating rating card. */}
      <div className="ar-badge ab-lay" style={v({ '--k': 3.4, '--d': '.9s' })}>
        <span className="ar-badge-stars">★★★★★</span>
        <span className="ar-badge-txt">
          <b>4.9</b>
          <em>App Store &amp; Play</em>
        </span>
      </div>

      <div className="wa-keys">
        <span className="wa-key is-on">iOS</span>
        <span className="wa-key is-on">Android</span>
      </div>

      <p className="wa-caption">One codebase, shipped to both stores.</p>
    </div>
  );
}
