'use client';

/**
 * DeviceRig — the hero object for 01 · Web & App Development.
 *
 * The craft sells two surfaces, so the artifact has to show two surfaces and the
 * relationship between them. CraftArtifact's `WebApp` (still used by the
 * homepage bento) shows both, but it assembles once and then stops — as a bento
 * thumbnail that is right, and as a hero it reads as a screenshot.
 *
 * This one never stops. It cycles three stages on a fixed interval and each
 * stage brings its own EVENT, so the loop is never the same beat twice:
 *
 *   web → the browser comes forward, the phone recedes, a sweep crosses the page
 *   app → the phone comes forward and scales up, and a push notification lands
 *   sys → both sit level and a component flies from the site into the app
 *
 * Stage is a `data-stage` attribute on the root and every response to it is a
 * CSS transition. React writes ONE attribute per 3.4s; nothing else re-renders,
 * and no layout is measured. The two per-stage events are the only mounted
 * elements — `{stage === 'app' && …}` is what replays their entry animation,
 * because an element that never unmounts can only play its keyframes once.
 *
 * Under reduced motion the stage is parked on `sys` — the frame that shows both
 * devices lit and level, i.e. the finished state of the argument rather than a
 * frozen mid-cycle. The keyframe loops are killed in CSS, not here.
 */
import { useEffect, useState } from 'react';

const STAGES = ['web', 'app', 'sys'] as const;
type Stage = (typeof STAGES)[number];

/** What the rig is saying at each stage — read by the caption and the keys. */
const CAPTION: Record<Stage, string> = {
  web: 'The site — fast, indexed, built to convert.',
  app: 'The app — offline, push, worth a home screen.',
  sys: 'One design system, one backend, both surfaces.',
};

/** Which surfaces are lit. `sys` lights all three: that is the whole point. */
const KEYS: { label: string; on: (s: Stage) => boolean }[] = [
  { label: 'Web', on: (s) => s !== 'app' },
  { label: 'iOS', on: (s) => s !== 'web' },
  { label: 'Android', on: (s) => s !== 'web' },
];

export default function DeviceRig() {
  const [stage, setStage] = useState<Stage>('web');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage('sys');
      return;
    }
    let n = 0;
    const t = setInterval(() => {
      n = (n + 1) % STAGES.length;
      setStage(STAGES[n]);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="wa-rig" data-stage={stage} aria-hidden="true">
      <span className="wa-halo" />

      {/* ── the site ─────────────────────────────────────────────────────── */}
      <div className="wa-browser">
        <div className="wa-chrome">
          <span /><span /><span />
          <div className="wa-url">
            <i className="wa-lock" />
            waheed.in
          </div>
          {/* A pulsing dot, not the word "live" — the chrome is ~15px tall, and
              a label small enough to fit in it is a smudge rather than a word. */}
          <span className="wa-live" />
        </div>

        <div className="wa-view">
          <div className="wa-topnav">
            <b />
            <i /><i /><i />
          </div>
          <div className="wa-blk" />
          <div className="wa-ln w78" />
          <div className="wa-ln w54" />
          <div className="wa-cards">
            <span /><span /><span />
          </div>
          <div className="wa-cta">Book a call</div>
          <span className="wa-scan" />
        </div>
      </div>

      {/* ── the app ──────────────────────────────────────────────────────── */}
      <div className="wa-phone">
        <span className="wa-notch" />
        <div className="wa-scr">
          {/* Mounted only on `app`, so unmounting is what rearms the slide-in. */}
          {stage === 'app' && (
            <div className="wa-push">
              <span className="wa-push-i" />
              <span className="wa-push-txt">
                <b />
                <em />
              </span>
            </div>
          )}
          <div className="wa-pblk" />
          <div className="wa-pln w82" />
          <div className="wa-pln w58" />
          <div className="wa-ptiles">
            <span /><span />
          </div>
        </div>
        <div className="wa-tabs">
          <i /><i /><i /><i />
        </div>
        {stage === 'app' && <span className="wa-tap" />}
      </div>

      {/* One component leaving the site and landing in the app — the only thing
          on the rig that crosses between the two devices. */}
      {stage === 'sys' && <span className="wa-share" />}

      <div className="wa-keys">
        {KEYS.map((k) => (
          <span key={k.label} className={`wa-key${k.on(stage) ? ' is-on' : ''}`}>
            {k.label}
          </span>
        ))}
      </div>

      <p key={stage} className="wa-caption">
        {CAPTION[stage]}
      </p>
    </div>
  );
}
