'use client';

/**
 * DeviceRig — the hero object for 01 · Web & App Development.
 *
 * Built in the homepage's floating-card language (`ff-` on HeroFoundersFlank):
 * SOLID light objects sitting straight on the hero gradient at different
 * parallax depths, lifted by shadow alone. No container panel, no translucent
 * fills, no borders — the first pass wrapped both devices in a tinted card and
 * that card read as a transparent tile, which is the one thing the homepage
 * collage never does.
 *
 * Two consequences worth knowing before editing:
 *
 *   · A recessed device is dimmed with `filter: brightness()`, never `opacity`.
 *     Fading a solid card is exactly how you get the translucent look back.
 *   · Each device sits in a `.wa-slot`, which owns POSITION, the entrance
 *     (`translate`) and the parallax (`transform`, via `.ab-lay`). The stage
 *     machine's own scale/offset lives on the device inside it. Two elements,
 *     because `transform` cannot be shared between parallax and stage.
 *
 * The rig cycles three stages on a fixed interval and each brings its own EVENT,
 * so the loop is never the same beat twice:
 *
 *   web → the site comes forward, the phone recedes, a sweep crosses the page
 *   app → the phone comes forward and a push notification lands on it, and the
 *         tap that follows moves the app's tab selection
 *   sys → both sit lit and level and a component flies from the site to the app
 *
 * Stage is a `data-stage` attribute on the root and every response to it is a
 * CSS transition. React writes ONE attribute per 3.4s; nothing else re-renders,
 * and no layout is measured. The two per-stage events are the only mounted
 * elements — `{stage === 'app' && …}` is what replays their entry animation,
 * because an element that never unmounts can only play its keyframes once.
 *
 * Under reduced motion the stage is parked on `sys` — both devices lit and
 * level, i.e. the finished state of the argument rather than a frozen
 * mid-cycle. The keyframe loops are killed in CSS, not here.
 */
import { useEffect, useState } from 'react';

const STAGES = ['web', 'app', 'sys'] as const;
type Stage = (typeof STAGES)[number];

/** Which surfaces the rig argues. Single-surface pages (Web / App Development)
 *  render only their own device; `both` is the cycling web↔app↔system rig. */
export type Surface = 'web' | 'app' | 'both';

/** What the rig is saying at each stage — read by the caption and the keys. */
const CAPTION: Record<Stage, string> = {
  web: 'The site — fast, indexed, built to convert.',
  app: 'The app — offline, push, worth a home screen.',
  sys: 'One design system, one backend, both surfaces.',
};

/** Which surfaces are lit, and which pages show each key. */
const KEYS: { label: string; on: (s: Stage) => boolean; when: Surface[] }[] = [
  { label: 'Web', on: (s) => s !== 'app', when: ['web', 'both'] },
  { label: 'iOS', on: (s) => s !== 'web', when: ['app', 'both'] },
  { label: 'Android', on: (s) => s !== 'web', when: ['app', 'both'] },
];

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function DeviceRig({ surface = 'both' }: { surface?: Surface }) {
  const [stage, setStage] = useState<Stage>(surface === 'app' ? 'app' : 'web');
  // `ping` re-keys the app's push/tap so their entrance replays on the app-only
  // page, where the stage never changes to re-arm them.
  const [ping, setPing] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (surface === 'web') { setStage('web'); return; }
    if (surface === 'app') {
      setStage('app');
      if (reduce) return;
      const t = setInterval(() => setPing((p) => p + 1), 3400);
      return () => clearInterval(t);
    }
    if (reduce) { setStage('sys'); return; }
    let n = 0;
    const t = setInterval(() => {
      n = (n + 1) % STAGES.length;
      setStage(STAGES[n]);
    }, 3400);
    return () => clearInterval(t);
  }, [surface]);

  const showWeb = surface !== 'app';
  const showApp = surface !== 'web';
  const caption = surface === 'both' ? CAPTION[stage] : CAPTION[surface];
  const keys = KEYS.filter((k) => k.when.includes(surface));
  const appEvent = stage === 'app';
  const pushKey = surface === 'app' ? ping : 'once';

  return (
    <div className={`wa-rig wa-rig--${surface}`} data-stage={stage} aria-hidden="true">
      <span className="wa-halo" />

      {/* ── the site ─────────────────────────────────────────────────────── */}
      {/* `--k` is parallax depth (bigger = nearer), `--d` the entrance stagger,
          both read by .ab-lay and the .is-in transition — same contract the
          homepage flanks use. */}
      {showWeb && (
      <div className="wa-slot wa-slot--web ab-lay" style={v({ '--k': 1.6, '--d': '.5s' })}>
        <div className="wa-browser">
          <div className="wa-chrome">
            <span /><span /><span />
            <div className="wa-url">
              <i className="wa-lock" />
              waheed.in
            </div>
            {/* A pulsing dot, not the word "live" — the chrome is ~16px tall,
                and a label small enough to fit in it is a smudge, not a word. */}
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
      </div>
      )}

      {/* ── the app ──────────────────────────────────────────────────────── */}
      {showApp && (
      <div className="wa-slot wa-slot--app ab-lay" style={v({ '--k': 2.8, '--d': '.72s' })}>
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
            <div className="wa-ptiles">
              <span /><span />
            </div>
            <div className="wa-pcta">Continue</div>

            {/* A short list under the fold of the app screen. It is here for
                proportion, not decoration: the phone's height is set by its
                aspect ratio, and without these rows the bottom third of the
                screen was empty above the tab bar. */}
            <div className="wa-plist">
              {[0, 1, 2].map((n) => (
                <span className="wa-prow" key={n}>
                  <i />
                  <span className="wa-prow-t">
                    <b />
                    <em />
                  </span>
                </span>
              ))}
            </div>

            <div className="wa-tabs">
              <i /><i /><i /><i />
            </div>
          </div>

          {/* Mounted only on `app`, so unmounting is what rearms the slide-in.
              A solid white card with its own shadow — the same object the
              homepage floats beside the founders. */}
          {appEvent && (
            <div key={`push-${pushKey}`} className="wa-push">
              <span className="wa-push-i" />
              <span className="wa-push-txt">
                <b />
                <em />
              </span>
            </div>
          )}
          {appEvent && <span key={`tap-${pushKey}`} className="wa-tap" />}
        </div>
      </div>
      )}

      {/* One component leaving the site and landing in the app — only on the
          combined rig, where both devices are present. */}
      {surface === 'both' && stage === 'sys' && <span className="wa-share" />}

      {keys.length > 0 && (
        <div className="wa-keys">
          {keys.map((k) => (
            <span key={k.label} className={`wa-key${k.on(stage) ? ' is-on' : ''}`}>
              {k.label}
            </span>
          ))}
        </div>
      )}

      <p key={surface === 'both' ? stage : surface} className="wa-caption">
        {caption}
      </p>
    </div>
  );
}
