'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CONSENT_COOKIE,
  CONSENT_EVENT,
  CONSENT_MAX_AGE,
  OPTIONAL_PURPOSES,
  RETIRED_COOKIES,
  firstPartyCookies,
  serializeConsent,
  type Consent,
  type Purpose,
} from '@/lib/consent';

/**
 * The consent UI. Two layers, and the interesting decisions are all about what
 * it is NOT allowed to do.
 *
 * · Layer one does not block the page. A banner that covers the content until
 *   you agree is a cookie wall, and consent obtained that way is not freely
 *   given. You can read the whole site with this bar sitting at the bottom.
 * · There is no close button on layer one. An X that dismisses the banner has
 *   to mean something, and every available meaning is wrong: treating it as
 *   consent is a lie, and treating it as refusal while still showing the bar is
 *   just a broken X. So the only ways out are the three real answers.
 * · Reject is the same size, shape and weight as Accept, on the same layer.
 *   This is the requirement most banners quietly fail (EDPB cookie banner
 *   taskforce, January 2023): a grey text link next to a big green button is a
 *   dark pattern, not a choice.
 * · Nothing is pre-ticked. The toggles start off, because a pre-ticked box is
 *   not the unambiguous affirmative act the GDPR asks for.
 *
 * Withdrawal has to be as easy as consent (Art 7(3)), which is why the footer
 * link fires CONSENT_EVENT and lands you straight back in layer two.
 *
 * The scripts themselves are gated in the root layout, not here. This component
 * only writes the cookie and then makes the page reflect it.
 */

type View = 'hidden' | 'banner' | 'panel';
type Choice = Record<Purpose, boolean>;

/*
 * Every purpose this component knows about comes from the register, never from
 * a literal here. When Microsoft Clarity was removed the compiler found six
 * hardcoded 'recording' strings in this file; deriving them means the next
 * removal is a one-line edit to consent.ts and nothing else.
 */
const ids = () => OPTIONAL_PURPOSES.map((p) => p.id);
const allSet = (on: boolean): Choice =>
  Object.fromEntries(ids().map((id) => [id, on])) as Choice;

/**
 * Delete the first-party cookies for a purpose that has just been switched off.
 *
 * Fired at every plausible domain and path spelling because a cookie can only
 * be deleted by an exact match on name + domain + path, and the vendor scripts
 * do not tell us which they used. Over-firing is free; a missed spelling leaves
 * the cookie sitting there after the visitor asked us to stop.
 */
function purgeCookies(names: string[]): void {
  if (names.length === 0) return;

  const host = window.location.hostname;
  const bare = host.replace(/^www\./, '');
  const domains = ['', host, `.${host}`, bare, `.${bare}`];

  for (const name of names) {
    for (const domain of domains) {
      const scope = domain ? `; Domain=${domain}` : '';
      document.cookie = `${name}=; Max-Age=0; Path=/${scope}`;
    }
  }
}

/** The cookies a given set of purposes is responsible for. */
const cookiesFor = (purposes: Purpose[]): string[] =>
  purposes.flatMap((p) => firstPartyCookies(p));

/** A stored decision as a Choice, defaulting anything unanswered to off. */
function pick(consent: Consent | null): Choice {
  return Object.fromEntries(ids().map((id) => [id, consent?.[id] === true])) as Choice;
}

export default function CookieConsent({ consent }: { consent: Consent | null }) {
  const router = useRouter();

  // Derived from a server prop, so the server and the first client render agree
  // and the bar does not flash in for visitors who decided months ago.
  const [view, setView] = useState<View>(consent ? 'hidden' : 'banner');
  const [choice, setChoice] = useState<Choice>(() => pick(consent));
  const [blocked, setBlocked] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const openPanel = useCallback(() => {
    setChoice(pick(consent));
    setBlocked(false);
    setView('panel');
  }, [consent]);

  // The footer link, and anything else that wants to reopen preferences.
  useEffect(() => {
    window.addEventListener(CONSENT_EVENT, openPanel);
    return () => window.removeEventListener(CONSENT_EVENT, openPanel);
  }, [openPanel]);

  /*
   * Sweep on every load: delete the cookies for anything not currently allowed.
   *
   * This is the second half of the purge in `decide`, and it is not redundant.
   * GA4 rewrites its session cookie from a pagehide handler, so deleting it and
   * then reloading loses the race — `_ga` stayed deleted and `_ga_<id>` came
   * straight back. Doing it again here wins because this page has no tracker in
   * it to fight back: whatever is denied is not running.
   *
   * It also catches the case nothing else could. Everyone who visited before
   * this banner existed was measured, and is carrying `_ga` and `_clck` right
   * now. Their first visit after the change shows them the banner while those
   * cookies sit there regardless of what they answer. This clears them on the
   * way in, which is the difference between asking for consent and acting on
   * the answer.
   */
  useEffect(() => {
    const denied = ids().filter((p) => !consent?.[p]);
    // RETIRED_COOKIES go every time regardless of consent: they belong to a
    // vendor this site no longer runs, so no answer permits them to stay.
    purgeCookies([...cookiesFor(denied), ...RETIRED_COOKIES]);
  }, [consent]);

  const decide = useCallback(
    (next: Choice) => {
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie =
        `${CONSENT_COOKIE}=${serializeConsent(next)}` +
        `; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

      // A browser that refuses the cookie would otherwise loop: reload, no
      // stored decision, banner again, forever. Say so instead.
      if (!document.cookie.includes(`${CONSENT_COOKIE}=`)) {
        setBlocked(true);
        return;
      }

      // Which purposes were ON in the page as it currently stands, and are now
      // off. Those scripts are already running, so the cookie alone is not
      // enough: they have to be taken out of the document.
      const revoked = ids().filter((p) => consent?.[p] && !next[p]);

      setView('hidden');

      if (revoked.length > 0) {
        purgeCookies(cookiesFor(revoked));
        window.location.reload();
        return;
      }

      // Nothing to tear down, so a server re-render is enough: the layout will
      // render the newly permitted <Script> tags into the tree.
      router.refresh();
    },
    [consent, router],
  );

  const acceptAll = () => decide(allSet(true));
  const rejectAll = () => decide(allSet(false));

  // ── Panel behaviour: focus in, Escape out, Tab stays inside ───────────────
  useEffect(() => {
    if (view !== 'panel') return;

    headingRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Backing out of the panel must never count as a decision. An undecided
        // visitor goes back to the banner; a decided one closes it entirely.
        setView(consent ? 'hidden' : 'banner');
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === headingRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [view, consent]);

  if (view === 'hidden') return null;

  // ── Layer one ────────────────────────────────────────────────────────────
  if (view === 'banner') {
    return (
      <div className="ck-bar" role="dialog" aria-modal="false" aria-labelledby="ck-bar-h">
        <div className="ck-bar-in">
          <div className="ck-bar-txt">
            <h2 id="ck-bar-h" className="ck-bar-h">Cookies, honestly</h2>
            <p>
              We would like to count visits, and to record how people move around the page so we
              can find what is confusing. Neither is necessary for the site to work, so neither
              runs unless you say yes. Nothing is loaded while you decide.{' '}
              <Link href="/cookies">What each one does</Link>.
            </p>
          </div>
          <div className="ck-actions">
            <button type="button" className="ck-btn ck-btn-yes" onClick={acceptAll}>
              Accept all
            </button>
            <button type="button" className="ck-btn ck-btn-no" onClick={rejectAll}>
              Reject all
            </button>
            <button type="button" className="ck-btn ck-btn-alt" onClick={openPanel}>
              Choose
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Layer two ────────────────────────────────────────────────────────────
  return (
    <div className="ck-scrim">
      <div
        className="ck-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ck-panel-h"
        ref={panelRef}
      >
        <h2 id="ck-panel-h" className="ck-panel-h" tabIndex={-1} ref={headingRef}>
          Choose what you share
        </h2>
        <p className="ck-panel-sub">
          Off by default, and off is a complete answer. You can change this whenever you like from
          the <em>Cookie settings</em> link in the footer.
        </p>

        <div className="ck-group ck-group-locked">
          <div className="ck-group-head">
            <span className="ck-group-title">Strictly necessary</span>
            <span className="ck-always">Always on</span>
          </div>
          <p className="ck-group-detail">
            Remembers the choice you make here, and keeps an administrator signed in. Sets no
            identifier that follows you anywhere else.
          </p>
        </div>

        {OPTIONAL_PURPOSES.map((p) => (
          <div className="ck-group" key={p.id}>
            <div className="ck-group-head">
              <label className="ck-toggle" htmlFor={`ck-${p.id}`}>
                <input
                  id={`ck-${p.id}`}
                  type="checkbox"
                  checked={choice[p.id]}
                  onChange={(e) => setChoice((c) => ({ ...c, [p.id]: e.target.checked }))}
                />
                <span className="ck-track" aria-hidden="true" />
                <span className="ck-group-title">{p.title}</span>
              </label>
            </div>
            <p className="ck-group-detail">{p.detail}</p>
            <p className="ck-group-who">
              {p.vendors.map((v) => v.name).join(', ')}
            </p>
          </div>
        ))}

        {blocked && (
          <p className="ck-blocked" role="alert">
            Your browser would not let us store your choice, so we cannot remember it. Nothing
            optional has been loaded, which is the safe outcome. Allowing cookies for waheed.in
            will let this stick.
          </p>
        )}

        <div className="ck-actions ck-actions-panel">
          <button type="button" className="ck-btn ck-btn-yes" onClick={() => decide(choice)}>
            Save my choices
          </button>
          <button type="button" className="ck-btn ck-btn-no" onClick={rejectAll}>
            Reject all
          </button>
          <button type="button" className="ck-btn ck-btn-alt" onClick={acceptAll}>
            Accept all
          </button>
        </div>

        <p className="ck-panel-foot">
          <Link href="/cookies">Every cookie, listed</Link>
          {' · '}
          <Link href="/privacy">Privacy policy</Link>
        </p>
      </div>
    </div>
  );
}
